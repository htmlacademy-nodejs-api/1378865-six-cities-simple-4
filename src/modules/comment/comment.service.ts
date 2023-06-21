import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { COMMENT_COUNT } from './comment.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import mongoose from 'mongoose';
import { FIRST_ARRAY_ELEMENT } from '../../constants/index.js';

const ObjectId = mongoose.Types.ObjectId;

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate(['userId', 'offerId']);
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId }, {}, { limit: COMMENT_COUNT })
      .sort({ createdAt: SortType.Down })
      .populate(['userId', 'offerId'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }

  public async calcRating(offerId: string): Promise<number | undefined> {
    const aggregatedComments = await this.commentModel.aggregate([
      { $match: { offerId: new ObjectId(offerId) } },
      {
        $group: {
          _id: '$offerId',
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    return aggregatedComments[FIRST_ARRAY_ELEMENT]?.avgRating;
  }
}
