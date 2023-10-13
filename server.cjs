app.get('/:uniqueString', async (req, res) => {
    const uniqueString = req.params.uniqueString;

    // Find the link in the database.
    const link = await Link.findOne({ generatedURL: 'https://redir-exdel-li.onrender.com/' + uniqueString });

    if (!link) {
        return res.status(404).json({ error: 'Link not found' });
    }

    // Check if the link is expired.
    if (new Date() > link.expirationDate) {
        return res.status(410).json({ error: 'Link expired' });
    }

    // Increment click count.
    link.clickCount++;
    await link.save();

    // Redirect based on click count.
    if (link.clickCount <= 7) {
        res.redirect('https://adlogx.wixsite.com/fortin');
    } else if (link.clickCount <= 12) {
        res.redirect('https://adlogx.wixsite.com/404error');
    } else {
        res.redirect('https://adlogx.wixsite.com/crogan');
    }
});
