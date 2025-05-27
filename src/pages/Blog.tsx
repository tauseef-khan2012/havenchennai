
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/shared/PageHero';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import { blogPosts } from '@/data/blogData';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <PageHero
          title="Haven Journal"
          subtitle="Stories of minimalist living, nature connection, and mindful experiences"
          backgroundImage="/lovable-uploads/3f68b7dc-fc1b-4cab-ac65-013e5c1e074f.png"
        />
        
        <div className="container-custom py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-1/4">
                <div className="sticky top-24 space-y-6">
                  <BlogSearch 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} 
                  />
                  <BlogCategories
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {filteredPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
