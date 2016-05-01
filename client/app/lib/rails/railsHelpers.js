export function authToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}