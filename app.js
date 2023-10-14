import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 10000;

// MongoDB Connection
mongoose.connect('mongodb+srv://Exdel:<weneedmoeny>@cluster0.klys9qy.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const linkSchema = new mongoose.Schema({
    originalURL: String,
    generatedURL: String,
    clickCount: Number,
    expirationDate: Date,
});

const Link = mongoose.model('Link', linkSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate a unique link
app.post('/generate-link', async (req, res) => {
    const originalURL = req.body.originalURL;

    // Generate a unique link.
    const generatedURL = await generateUniqueLink();
    const clickCount = 0;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 6); // Six days from now.

    // Save the link in the database.
    const newLink = new Link({ originalURL, generatedURL, clickCount, expirationDate });
    await newLink.save();

    res.json({ generatedURL });
});

// Route to redirect to a generated link
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

    // Determine the URL to redirect based on click count.
    let targetURL;
    if (link.clickCount < 7) {
        targetURL = 'https://adlogx.wixsite.com/fortin';
    } else if (link.clickCount < 12) {
        targetURL = 'https://adlogx.wixsite.com/404error';
    } else {
        targetURL = 'https://adlogx.wixsite.com/crogan';
    }

    // Redirect to the determined target URL.
    res.redirect(targetURL);
});

async function generateUniqueLink() {
    let generatedURL;
    let isUnique = false;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    while (!isUnique) {
        generatedURL = 'https://redir-exdel-li.onrender.com/' + generateRandomCharacters(8, characters);
        const existingLink = await Link.findOne({ generatedURL });
        if (!existingLink) {
            isUnique = true;
        }
    }
    return generatedURL;
}

function generateRandomCharacters(length, characters) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
    console.log(`Listening on PORT ${10000}`);
});

export default app;
