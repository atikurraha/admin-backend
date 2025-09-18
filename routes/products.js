const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// সমস্ত প্রোডাক্ট পাওয়া
router.get('/', auth, admin, async (req, res) => {
  try {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword 
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i'
          }
        }
      : {};
    
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// নতুন প্রোডাক্ট তৈরি
router.post('/', auth, admin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      sku,
      category,
      brand,
      stock,
      sizes,
      colors,
      tags,
      isActive,
      isFeatured
    } = req.body;

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      sku,
      category,
      brand,
      images,
      stock,
      sizes: sizes ? sizes.split(',') : [],
      colors: colors ? colors.split(',') : [],
      tags: tags ? tags.split(',') : [],
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// প্রোডাক্ট আপডেট
router.put('/:id', auth, admin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      sku,
      category,
      brand,
      stock,
      sizes,
      colors,
      tags,
      isActive,
      isFeatured
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.shortDescription = shortDescription || product.shortDescription;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock || product.stock;
      product.sizes = sizes ? sizes.split(',') : product.sizes;
      product.colors = colors ? colors.split(',') : product.colors;
      product.tags = tags ? tags.split(',') : product.tags;
      product.isActive = isActive !== undefined ? isActive === 'true' : product.isActive;
      product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;

      if (req.files && req.files.length > 0) {
        product.images = req.files.map(file => `/uploads/${file.filename}`);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// প্রোডাক্ট ডিলিট
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
