export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, price } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const shopifyRes = await fetch(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-01/products.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY,
        },
        body: JSON.stringify({
          product: {
            title,
            body_html: description,
            variants: [{ price }],
          },
        }),
      }
    );

    const data = await shopifyRes.json();
    return res.status(200).json({ success: true, product: data });
  } catch (err) {
    return res.status(500).json({ error: "Shopify error", details: err });
  }
}
