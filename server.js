const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 1007;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Transaction schema
const transactionSchema = new mongoose.Schema({
  text: String,
  amount: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { text, amount } = req.body;
    const transaction = new Transaction({ text, amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

