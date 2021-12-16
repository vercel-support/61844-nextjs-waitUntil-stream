function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function middleware(req, event) {
  if (req.nextUrl.pathname === '/responses/send-response') {
    const { readable, writable } = new TransformStream();

    event.waitUntil(
      (async () => {
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        writer.write(encoder.encode('Hello, world! Streamed!'));
        await sleep(5000);
        writer.write(encoder.encode('response'));
        await sleep(5000);
        writer.write(encoder.encode('response 2'));
        writer.close();
      })(),
    );

    return new Response(readable);
  }
}
