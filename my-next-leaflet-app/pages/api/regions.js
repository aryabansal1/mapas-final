import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { lat, lng } = req.body;

  console.log(`Prueba 1: Latitude: ${lat}, Longitude: ${lng}`);

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Thinker21!!!',
      database: 'mapasdigitales'
    });

    // Check if the connection is successful
    console.log('Database connection established.');

    var sql = `SELECT id_region, name FROM region WHERE ST_Contains(geom, ST_SRID(ST_GeomFromText('POINT(? ? )'), 4326));`; 
    const [regionRows] = await connection.query(sql, [lng, lat]); // Note that longitude comes before latitude

    // Log the SQL query results
    console.log('Region query result:', regionRows);

    if (regionRows.length === 0) {
      await connection.end();
      console.log('Region not found.');
      return res.status(404).json({ message: 'Region not found' });
    }

    // Initialize response data
    const responseData = {
      regions: []
    };

    // Loop through each region row
    for (const region of regionRows) {
      const regionId = region.id_region;
      const regionName = region.name;

      // Log the region ID and name
      console.log('Region ID:', regionId);
      console.log('Region Name:', regionName);

      var productSql = `SELECT product_ID, URL, variable FROM digital_product WHERE region = ?;`;
      const [productRows] = await connection.query(productSql, [regionId]);

      // Log the product query results
      console.log('Product query result:', productRows);

      // Add the region and its products to the response data
      responseData.regions.push({
        regionName: regionName,
        products: productRows
      });
    }

    await connection.end();

    console.log('Response data:', responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
