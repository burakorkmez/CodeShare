const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const Document = require('./models/Document');

mongoose.connect('mongodb://localhost/codeshare', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

app.get('/', (req, res) => {
	const code = `Welcome to CodeShare!

Use the commands in the top right corner
to create a new file to share with others.`;

	res.render('code-display', { code, language: 'plaintext' });
});

app.get('/new', (req, res) => {
	res.render('new');
});

app.post('/save', async (req, res) => {
	const value = req.body.value;
	try {
		const document = await Document.create({ value });
		res.redirect(`/${document.id}`);
	} catch (err) {
		res.render('new', { value });
	}
	console.log(value);
});

app.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render('code-display', { code: document.value, id });
	} catch (err) {
		res.redirect('/');
	}
});

app.get('/:id/duplicate', async (req, res) => {
	const id = req.params.id;
	try {
		const document = await Document.findById(id);
		res.render('new', { value: document.value });
	} catch (err) {
		res.redirect(`/${id}`);
	}
});

app.listen(3000);
