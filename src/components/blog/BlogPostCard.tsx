
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  slug: string;
  readTime: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Link to={`/blog/${post.slug}`}>
            <div className="aspect-[16/9] md:aspect-square overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{post.category}</span>
            </div>
            <span>{post.readTime}</span>
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-2xl font-serif font-bold text-haven-dark mb-3 hover:text-haven-teal transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <Link to={`/blog/${post.slug}`}>
            <Button variant="outline" className="border-haven-teal text-haven-teal hover:bg-haven-teal hover:text-white">
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
