const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// Middleware to ensure user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// List books for logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
  const books = await Book.find({ userId: req.user._id }).lean();
  res.render('books', { books, user: req.user });
});

// Add new book form (optional)
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('addBook');
});

// Add book POST handler
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { title, author, genre, status, thumbnail } = req.body;
  await Book.create({ title, author, genre, status, thumbnail, userId: req.user._id });
  res.redirect('/books');
});

// Delete book POST handler
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  await Book.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.redirect('/books');
});

// Update book status POST handler
router.post('/status/:id', ensureAuthenticated, async (req, res) => {
  const { status } = req.body;
  if (!['read', 'reading', 'planned'].includes(status)) return res.status(400).send('Invalid status');
  await Book.updateOne({ _id: req.params.id, userId: req.user._id }, { status });
  res.redirect('/books');
});

module.exports = router;