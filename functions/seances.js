exports.handler = async function(event, context) {
  const apiKey = process.env.KEY_AIRTABLE;
  const url = 'https://api.airtable.com/v0/appGvLvD3Rprsv2hs/Seances_filtrees';

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erreur API Airtable : ", errorText);
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "Airtable API error", detail: errorText })
      };
    }

    const data = await res.json();

    if (!data.records) {
      console.error("Réponse inattendue :", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No records found", raw: data })
      };
    }

    const cleaned = data.records
      .map(record => ({
        date: record.fields.Date_seance,
        amount: record.fields.Montant_seance_dashboard
      }))
      .filter(r => r.date && r.amount);

    return {
      statusCode: 200,
      body: JSON.stringify(cleaned)
    };

  } catch (err) {
    console.error("Erreur dans la fonction serverless :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message })
    };
  }
};