import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private uploadService: UploadService,
  ) {}

  async create(
    createMovieDto: CreateMovieDto,
    poster: Express.Multer.File,
    userId: string,
  ) {
    try {
      let posterUrl = '';

      if (poster) {
        posterUrl = await this.uploadService.uploadFile(poster);
      } else {
        posterUrl = '';
      }

      // Create movie
      const movie = new this.movieModel({
        ...createMovieDto,
        poster: posterUrl,
        createdBy: new Types.ObjectId(userId),
      });

      await movie.save();

      return {
        message: 'Movie created successfully',
        movie: await this.findById(movie.id, userId),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create movie');
    }
  }

  async findAll(query: MovieQueryDto, userId: string) {
    try {
      const { page = 1, limit = 8, search } = query;
      const skip = (page - 1) * limit;

      // Build search filter
      const filter: any = { createdBy: new Types.ObjectId(userId) };
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      // Get movies with pagination
      const [movies, total] = await Promise.all([
        this.movieModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.movieModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        movies,
        pagination: {
          currentPage: page,
          totalPages,
          totalMovies: total,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch movies');
    }
  }

  async findById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid movie ID');
      }

      const movie = await this.movieModel
        .findOne({ _id: id, createdBy: new Types.ObjectId(userId) })
        .exec();

      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      return movie;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch movie');
    }
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    poster: Express.Multer.File | undefined,
    userId: string,
  ) {
    try {
      // Check if movie exists and belongs to user
      const existingMovie = await this.findById(id, userId);

      const updateData: any = { ...updateMovieDto };

      // Handle poster update
      if (poster) {
        // Upload new poster
        const newPosterUrl = await this.uploadService.uploadFile(poster);

        // Delete old poster
        await this.uploadService.deleteFile(existingMovie.poster);

        updateData.poster = newPosterUrl;
      }

      const updatedMovie = await this.movieModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      return {
        message: 'Movie updated successfully',
        movie: updatedMovie,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update movie');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const movie = await this.findById(id, userId);

      // Delete poster from S3
      await this.uploadService.deleteFile(movie.poster);

      // Delete movie from database
      await this.movieModel.findByIdAndDelete(id).exec();

      return {
        message: 'Movie deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete movie');
    }
  }
}
