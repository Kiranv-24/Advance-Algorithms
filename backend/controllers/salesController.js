const db = require("../config/db");

exports.getSalesDetails = async (req, res) => {
  const { startDate, endDate } = req.query;
  const productId = req.params.productId;

  // Validate input
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Start date and end date are required." });
  }

  try {
    // Fetch product details from the products table
    const [productDetails] = await db.query(
      "SELECT name, quantity AS totalLeftInStock FROM products WHERE id = ?",
      [productId]
    );

    // Check if product exists
    if (!productDetails || productDetails.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Fetch total quantity sold
    const [totalSalesDetails] = await db.query(
      `
        SELECT COALESCE(SUM(CAST(oi.quantity AS UNSIGNED)), 0) AS quantitySold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.product_id = ? 
        AND o.created_at >= ? 
        AND o.created_at <= ?
      `,
      [productId, startDate + " 00:00:00", endDate + " 23:59:59"]
    );

    // Fetch daily sales details
    const [dailySalesDetails] = await db.query(
      `
        SELECT 
          DATE(o.created_at) AS saleDate,
          COALESCE(SUM(CAST(oi.quantity AS UNSIGNED)), 0) AS dailyQuantitySold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.product_id = ? 
        AND o.created_at >= ? 
        AND o.created_at <= ?
        GROUP BY DATE(o.created_at)
        ORDER BY DATE(o.created_at)
      `,
      [productId, startDate + " 00:00:00", endDate + " 23:59:59"]
    );

    // Prepare response
    const response = {
      name: productDetails[0].name,
      quantitySold: totalSalesDetails[0].quantitySold,
      totalLeftInStock: productDetails[0].totalLeftInStock,
      startDate,
      endDate,
      dailySales: dailySalesDetails,
    };
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error("Error fetching sales details:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
