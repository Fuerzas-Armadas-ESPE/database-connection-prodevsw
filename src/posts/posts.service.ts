import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'mongoose';

@Injectable()
export class PostsService {
  private posts: Schema[] = [];
  constructor(@InjectModel('Post') private readonly postModel: Model<any>) {}

  async getAllPosts(): Promise<any[]> {
    return await this.postModel.find().exec();
  }

  async getPost(id: string): Promise<any | null> {
    return await this.postModel.findById(id).exec();
  }

  async createPost(postData: any): Promise<any> {
    const newPost = new this.postModel({
      id: uuidv4(),
      title: postData.title,
      content: postData.content,
    });
    try {
      return await newPost.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePost(id: string, postData: any): Promise<any | null> {
    const postIndex = this.postModel.findById((posts) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    this.posts[postIndex] = { ...this.posts[postIndex], ...postData };

    return this.posts[postIndex]; // Implementa el método de actualización si es necesario
  }

  async deletePost(id: string): Promise<void> {
    // Implementa el método de eliminación si es necesario
  }
}
