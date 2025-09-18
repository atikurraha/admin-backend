const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// রাউট ইমপোর্ট
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const supplierRoutes = require('./routes/suppliers');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const pageRoutes = require('./routes/pages');
const blogRoutes = require('./routes/blog');
const mediaRoutes = require('./routes/media');

// এনভায়রনমেন্ট ভেরিয়েবল লোড
dotenv.config();

const app = express();

// মিডলওয়্যার
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// স্ট্যাটিক ফাইল সার্ভ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ডাটাবেস কানেকশন
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// API রাউট
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/reviews', reviewRoutes);
app.use('/api/admin/suppliers', supplierRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/admin/reports', reportRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/pages', pageRoutes);
app.use('/api/admin/blog', blogRoutes);
app.use('/api/admin/media', mediaRoutes);

// প্রোডাকশনে ফ্রন্টএন্ড সার্ভ
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.ADMIN_PORT || 5001;
app.listen(PORT, () => console.log(`Admin server running on port ${PORT}`));
