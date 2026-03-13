import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Navigation, LocateFixed, QrCode, Smartphone, MapPin, Camera, ArrowUpRight } from 'lucide-react';

const toRad = (value) => (value * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const PlaceNavigationAssistant = ({ destination }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const distanceKm = useMemo(
    () => getDistanceKm(currentLocation, destination ? { lat: destination.lat, lng: destination.lng } : null),
    [currentLocation, destination],
  );

  const arNavigationUrl = useMemo(() => {
    if (!destination) return '';
    const dest = `${destination.lat},${destination.lng}`;
    const origin = currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : '';
    return `https://www.google.com/maps/dir/${origin}/${dest}/@${destination.lat},${destination.lng},17z/data=!3m1!1e3!4m2!4m1!3e2`;
  }, [destination, currentLocation]);

  const enableLocation = () => {
    if (!navigator.geolocation || !destination) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsGettingLocation(false);
      },
      () => setIsGettingLocation(false),
      { enableHighAccuracy: true },
    );
  };

  if (!destination) return null;

  return (
    <div className="bg-white rounded-4xl border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Camera size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">AR Navigation</h3>
          <p className="text-xs text-slate-500">Scan QR → opens your phone camera with live walking arrows</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={enableLocation}
          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <LocateFixed size={16} />
          {isGettingLocation ? 'Locating...' : 'My Location'}
        </button>

        <button
          onClick={() => setShowQR(!showQR)}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
            showQR ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'
          }`}
        >
          <QrCode size={16} />
          {showQR ? 'Hide QR' : 'Show Navigation QR'}
        </button>
      </div>

      {showQR && (
        <div className="mt-2 mb-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <QRCodeSVG
                value={arNavigationUrl}
                size={180}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-700 font-black text-lg mb-2">
                <Smartphone size={20} />
                Scan &amp; Navigate
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Open your phone camera and scan this QR</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Google Maps opens with walking directions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Tap <strong>"Live View"</strong> for AR camera with arrows overlay</span>
                </div>
              </div>
              <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <strong>Tip:</strong> On Google Maps, tap the <ArrowUpRight size={12} className="inline" /> Live View button to activate phone camera with directional arrows
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <MapPin size={16} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-700 font-bold">{destination.name}</p>
          {destination.address && <p className="text-xs text-slate-400">{destination.address}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
            {distanceKm ? `${distanceKm.toFixed(1)} km` : '—'}
          </p>
          <p className="text-[10px] text-slate-400">{distanceKm ? 'away' : 'locate first'}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceNavigationAssistant;
