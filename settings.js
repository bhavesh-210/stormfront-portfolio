export const defaults = Object.freeze({ quality: 'standard', sensitivity: 1, sound: false, reduced: false, finish: 'olive', gear: 'scanner', environment: 'dawn' });
export function sanitizeSettings(value) {
  const s = { ...defaults }; if (!value || typeof value !== 'object') return s;
  for (const [key, allowed] of Object.entries({ quality: ['low', 'standard', 'high'], finish: ['olive', 'sand', 'graphite'], gear: ['scanner', 'case', 'radio', 'carbine'], environment: ['dawn', 'overcast'] })) if (allowed.includes(value[key])) s[key] = value[key];
  if (Number.isFinite(value.sensitivity)) s.sensitivity = Math.max(.3, Math.min(2, value.sensitivity));
  for (const k of ['sound', 'reduced']) if (typeof value[k] === 'boolean') s[k] = value[k];
  return s;
}
export function loadSettings(storage) { try { return sanitizeSettings(JSON.parse((storage ?? globalThis.localStorage).getItem('stormfront-settings'))); } catch { return { ...defaults }; } }
export function saveSettings(value, storage) { try { (storage ?? globalThis.localStorage).setItem('stormfront-settings', JSON.stringify(sanitizeSettings(value))); return true; } catch { return false; } }
