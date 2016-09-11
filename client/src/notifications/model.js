export function build(status, msg) {
  return {
    id: Date.now(),
    status,
    msg,
  }
}
