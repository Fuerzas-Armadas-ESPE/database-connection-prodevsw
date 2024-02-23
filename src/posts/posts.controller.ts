import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {  RequestLogDocument} from '../modules/request-log/request-log.shema'; // Importa el tipo de documento del esquema de registro de solicitudes

import {PostSchema as PostSchema} from './post.model'; 
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(): Promise<RequestLogDocument[]> {
    // Usa el tipo de documento del esquema de registro de solicitudes
    return this.postsService.getAllPosts();
  }
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<RequestLogDocument[]> {
    const post = await this.postsService.getPost(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Post()
  // Aplica el guardia JwtAuthGuard al método createPost
  async createPost(@Body() postData: typeof PostSchema): Promise<RequestLogDocument[]> { // Replace PostSchema with typeof PostModel
    try {
      console.log('Received postData:', postData); // Add this debug log
      return await this.postsService.createPost(postData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() postData: PostSchema,
  ): Promise<RequestLogDocument[]> {
    if (!postData && !postData.content) {
      throw new BadRequestException(
        'At least one of title or content must be provided',
      );
    }
    return this.postsService.updatePost(id, postData);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
