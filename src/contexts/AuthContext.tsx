import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

type Organization = {
  id: string;
  name: string;
};

type AuthContextValue = {
  user: any | null;
  loading: boolean;
  organization: Organization | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  organization: null,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

async function loadOrgAndRole(user: any): Promise<{
  organization: Organization | null;
  isAdmin: boolean;
}> {
  try {
    if (!user?.email) {
      return { organization: null, isAdmin: false };
    }

    const { data: member, error: memberError } = await supabase
      .from("organization_members")
      .select("organization_id, role")
      .eq("email", user.email)
      .maybeSingle();

    if (memberError && memberError.code !== "PGRST116") {
      console.error("Error loading org membership:", memberError);
    }

    if (!member) {
      return { organization: null, isAdmin: false };
    }

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("id", member.organization_id)
      .maybeSingle();

    if (orgError) {
      console.error("Error loading organization:", orgError);
      return { organization: null, isAdmin: false };
    }

    return {
      organization: org ? { id: org.id, name: org.name } : null,
      isAdmin: member.role === "admin",
    };
  } catch (err) {
    console.error("loadOrgAndRole failed:", err);
    return { organization: null, isAdmin: false };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data?.user) {
        setUser(null);
        setOrganization(null);
        setIsAdmin(false);
        setLoading(false);
      } else {
        setUser(data.user);
        const result = await loadOrgAndRole(data.user);
        if (!isMounted) return;
        setOrganization(result.organization);
        setIsAdmin(result.isAdmin);
        setLoading(false);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const nextUser = session?.user ?? null;
          if (!isMounted) return;

          setUser(nextUser);

          if (nextUser) {
            const result = await loadOrgAndRole(nextUser);
            if (!isMounted) return;
            setOrganization(result.organization);
            setIsAdmin(result.isAdmin);
          } else {
            setOrganization(null);
            setIsAdmin(false);
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    organization,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
