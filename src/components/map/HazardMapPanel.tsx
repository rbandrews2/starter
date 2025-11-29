import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type HazardType = "hazard" | "disabled_vehicle" | "incident";
type Severity = "low" | "medium" | "high";

type HazardMarker = {
  id: string;
  organization_id: string | null;
  created_by: string | null;
  created_at: string;
  type: HazardType;
  title: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  severity: Severity | null;
  is_active: boolean;
};

const defaultCenter: LatLngLiteral = {
  // Fallback center – you can change this to your region
  lat: 37.2707,
  lng: -79.9414,
};

const getColorForMarker = (m: HazardMarker): string => {
  if (m.type === "hazard") {
    if (m.severity === "high") return "#ef4444"; // red
    if (m.severity === "low") return "#22c55e"; // green
    return "#f97316"; // orange
  }
  if (m.type === "disabled_vehicle") return "#38bdf8"; // blue
  if (m.type === "incident") return "#eab308"; // yellow
  return "#facc15";
};

const formatTypeLabel = (t: HazardType): string => {
  if (t === "hazard") return "Unsafe / Hazard Area";
  if (t === "disabled_vehicle") return "Disabled Vehicle / Equipment";
  if (t === "incident") return "Accident / Incident";
  return t;
};

const formatSeverityLabel = (s: Severity): string => {
  if (s === "low") return "Low";
  if (s === "high") return "High";
  return "Medium";
};

const ClickHandler: React.FC<{ onSelect: (latlng: LatLngLiteral) => void }> = ({
  onSelect,
}) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });

  return null;
};

const ResizeHandler: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const handle = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
    };
  }, [map]);

  return null;
};

const HazardMapPanel: React.FC = () => {
  const { user, organization } = useAuth();

  const [center, setCenter] = useState<LatLngLiteral>(defaultCenter);
  const [markers, setMarkers] = useState<HazardMarker[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draftPosition, setDraftPosition] = useState<LatLngLiteral | null>(null);
  const [type, setType] = useState<HazardType>("hazard");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSave =
    !!user && !!organization && !!draftPosition && description.trim().length > 5 && !saving;

  const loadMarkers = async () => {
    if (!organization) {
      setMarkers([]);
      return;
    }
    setLoadingMarkers(true);
    const { data, error } = await supabase
      .from("hazard_markers")
      .select(
        "id, organization_id, created_by, created_at, type, title, description, latitude, longitude, severity, is_active"
      )
      .eq("organization_id", organization.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading hazard markers:", error);
      setLoadingMarkers(false);
      return;
    }
    setMarkers((data ?? []) as HazardMarker[]);
    setLoadingMarkers(false);
  };

  useEffect(() => {
    void loadMarkers();
  }, [organization?.id]);

  // Try to center on user location once
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(next);
      },
      () => {
        // silently ignore geolocation errors
      },
      { enableHighAccuracy: true, maximumAge: 300000 }
    );
  }, []);

  const handleUseMyLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(next);
        setDraftPosition(next);
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  const handleSaveMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || !user || !organization || !draftPosition) return;
    try {
      setSaving(true);
      const payload = {
        organization_id: organization.id,
        created_by: user.id,
        type,
        title: title || null,
        description: description || null,
        latitude: draftPosition.lat,
        longitude: draftPosition.lng,
        severity,
        is_active: true,
      };
      const { error } = await supabase.from("hazard_markers").insert(payload);
      if (error) {
        console.error("Error saving hazard marker:", error);
        return;
      }
      setTitle("");
      setDescription("");
      setSeverity("medium");
      // Keep draftPosition where it is so they can add another quickly if needed
      await loadMarkers();
    } finally {
      setSaving(false);
    }
  };

  const latestMarkers = useMemo(() => markers.slice(0, 10), [markers]);

  if (!user || !organization) {
    return (
      <Card className="bg-black/40 border border-amber-500/30 text-white p-6">
        <h3 className="text-xl font-semibold text-amber-300 mb-2">
          Hazard Map & Location Sharing
        </h3>
        <p className="text-sm text-gray-300">
          Sign in and join an organization to mark unsafe areas, disabled vehicles/equipment, and
          accidents on the live map for your crews.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/40 border border-amber-500/30 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-amber-300">
              Hazard Map & Live Location Markers
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Click on the map or use your current location to drop pins for unsafe areas, disabled
              vehicles/equipment, and accident locations. Each marker is saved for your organization.
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-amber-500/60 text-amber-200 text-[10px] sm:text-[11px] bg-black/40"
          >
            Org: {organization.name}
          </Badge>
        </div>
      </Card>

      {/* Map + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 bg-black/40 border border-amber-500/30 overflow-hidden">
          <div className="h-[360px] sm:h-[420px]">
            <MapContainer
              {...({ center, zoom: 13, style: { width: "100%", height: "100%" }, scrollWheelZoom: true } as any)}
            >
              <TileLayer
                {...({ attribution: '&copy; OpenStreetMap contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any)}
              />
              <ClickHandler onSelect={setDraftPosition} />
              <ResizeHandler />

              {/* Draft marker */}
              {draftPosition && (
                <CircleMarker
                  {...({ center: draftPosition, radius: 14, pathOptions: {
                    color: "#f97316",
                    fillColor: "#f97316",
                    fillOpacity: 0.5,
                    weight: 2,
                  } } as any)}
                >
                  <Popup>
                    Draft marker<br />
                    This is where the next hazard/location will be saved.
                  </Popup>
                </CircleMarker>
              )}

              {/* Saved markers */}
              {markers.map((m) => (
                <CircleMarker
                  {...({ key: m.id, center: { lat: m.latitude, lng: m.longitude }, radius: 12, pathOptions: {
                    color: getColorForMarker(m),
                    fillColor: getColorForMarker(m),
                    fillOpacity: 0.8,
                    weight: 2,
                  } } as any)}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {m.title || formatTypeLabel(m.type)}
                      </p>
                      <p className="text-[11px] text-gray-600">
                        {formatTypeLabel(m.type)} •{" "}
                        {m.severity ? `Severity: ${formatSeverityLabel(m.severity)}` : "Severity: n/a"}
                      </p>
                      {m.description && (
                        <p className="text-[11px] mt-1">{m.description}</p>
                      )}
                      <p className="text-[10px] text-gray-500 mt-1">
                        Created: {new Date(m.created_at).toLocaleString()}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

            </MapContainer>
          </div>
        </Card>

        {/* Controls + Recent list */}
        <Card className="bg-black/40 border border-amber-500/30 text-white p-4 sm:p-6">
          <form onSubmit={handleSaveMarker} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-amber-300">
                Drop a New Marker
              </h3>
              <Button
                type="button"
                variant="outline"
                className="border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/15 text-[11px] px-3 py-1"
                onClick={handleUseMyLocation}
              >
                Use My Location
              </Button>
            </div>

            <p className="text-[11px] text-gray-300">
              Click anywhere on the map to choose a location, then describe what&apos;s going on.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300">Marker type</label>
                <Select
                  value={type}
                  onValueChange={(val) => setType(val as HazardType)}
                >
                  <SelectTrigger className="bg-black/60 border-gray-700 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-800">
                    <SelectItem value="hazard">Unsafe / Hazard Area</SelectItem>
                    <SelectItem value="disabled_vehicle">
                      Disabled Vehicle / Equipment
                    </SelectItem>
                    <SelectItem value="incident">
                      Accident / Incident Location
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300">Severity</label>
                <Select
                  value={severity}
                  onValueChange={(val) => setSeverity(val as Severity)}
                >
                  <SelectTrigger className="bg-black/60 border-gray-700 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-800">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                Short title (optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blind curve with poor sight distance"
                className="bg-black/60 border-gray-700 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                Explanation / details
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/60 border-gray-700 text-sm min-h-[80px]"
                placeholder="Explain the hazard, disabled asset, or accident clearly and briefly."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300">
                Selected location (lat / lng)
              </label>
              <div className="text-[11px] text-gray-300 bg-black/50 border border-gray-800 rounded px-2 py-1">
                {draftPosition
                  ? `${draftPosition.lat.toFixed(5)}, ${draftPosition.lng.toFixed(5)}`
                  : "Click on the map or use your current location to set a point."}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!canSave}
                className="bg-amber-500 hover:bg-amber-400 text-black text-sm px-6"
              >
                {saving ? "Saving..." : "Save Marker"}
              </Button>
            </div>
          </form>

          {/* Recent markers list */}
          <div className="mt-4 border-t border-amber-500/20 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-300">
                Recent markers
              </h4>
              <span className="text-[10px] text-gray-400">
                {loadingMarkers
                  ? "Loading..."
                  : `${markers.length} total marker${markers.length === 1 ? "" : "s"}`}
              </span>
            </div>
            <ScrollArea className="h-[140px] pr-1">
              <div className="space-y-2">
                {latestMarkers.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-lg border border-gray-800 bg-black/60 px-2 py-1.5 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-gray-100 line-clamp-1">
                        {m.title || formatTypeLabel(m.type)}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-amber-500/40 text-amber-200 bg-black/40"
                      >
                        {formatSeverityLabel((m.severity ?? "medium") as Severity)}
                      </Badge>
                    </div>
                    {m.description && (
                      <p className="text-[10px] text-gray-400 line-clamp-2">
                        {m.description}
                      </p>
                    )}
                    <p className="text-[9px] text-gray-500">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
                {latestMarkers.length === 0 && !loadingMarkers && (
                  <p className="text-[11px] text-gray-400">
                    No markers yet. Use the map above to drop your first hazard or location.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HazardMapPanel;
