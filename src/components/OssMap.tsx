import { useEffect, useRef } from "react";
import {
  Map,
  Popup,
  LngLatBounds,
  Marker,
  NavigationControl,
  addProtocol,
  setWorkerUrl,
  type Map as MapType,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
setWorkerUrl(workerUrl);
import { Protocol } from "pmtiles";
let protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);
import { withBase } from "../lib/base";

export type OssPoint = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  href: string;
  event?: string;
  location?: string;
  date?: string;
};

type Props = {
  points: OssPoint[];
  /** マーカー1件のときのズーム(詳細ページ用) */
  singleZoom?: number;
  /** 地図の高さ(CSS 値) */
  height?: string;
};

const OssMap = ({ points, singleZoom = 12, height = "70vh" }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapType | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;
    if (points.length === 0) return;

    const first = points[0];

    const map = new Map({
      container: containerRef.current,
      style: withBase("/osm-buildings.json"),
      center: [first.longitude, first.latitude],
      zoom: singleZoom,
    });

    map.addControl(new NavigationControl(), "top-right");

    const markers: Marker[] = [];
    for (const p of points) {
      const popupHtml = `
        <div style="font-size:14px;line-height:1.4">
          <div style="font-weight:700;margin-bottom:4px;">${escapeHtml(p.title)}</div>
          ${p.event ? `<div>${escapeHtml(p.event)}</div>` : ""}
          ${p.date ? `<div style="color:#6b7280">${escapeHtml(p.date)}</div>` : ""}
          ${p.location ? `<div style="color:#6b7280">${escapeHtml(p.location)}</div>` : ""}
          <div style="margin-top:6px;">
            <a href="${p.href}">詳細へ →</a>
          </div>
        </div>
      `;
      const popup = new Popup({ offset: 18 }).setHTML(popupHtml);
      const marker = new Marker({ color: "#2563eb" })
        .setLngLat([p.longitude, p.latitude])
        .setPopup(popup)
        .addTo(map);
      markers.push(marker);
    }

    if (points.length > 1) {
      const bounds = new LngLatBounds();
      for (const p of points) bounds.extend([p.longitude, p.latitude]);
      map.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    }

    mapRef.current = map;

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [points, singleZoom]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    />
  );
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default OssMap;
