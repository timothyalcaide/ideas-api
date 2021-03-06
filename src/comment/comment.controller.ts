import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { CustomValidationPipe } from 'src/shared/custom-validation.pipe';
import { User } from 'src/shared/user.decorator';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Get()
    showAllComments() {
        return this.commentService.showAll()
    }

    @Get(':id')
    showComment(@Param('id') id: string) {
        this.logData({ id })
        return this.commentService.show(id)
    }

    @Get('idea/:id')
    showCommentsByIdea(@Param('id') idea: string, @Query('page') page: number) {
        this.logData({ idea })
        return this.commentService.showByIdea(idea, page)
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') user: string, @Query('page') page: number) {
        this.logData({ user })
        return this.commentService.showByUser(user, page)
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new CustomValidationPipe())
    createComment(
        @Param('id') idea: string,
        @User('id') user: string,
        @Body() data: CommentDTO
    ) {
        this.logData({ idea, user, data })
        return this.commentService.create(idea, user, data)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyComment(@Param('id') commentId: string, @User('id') userId: string) {
        this.logData({ commentId, userId })
        return this.commentService.destroy(commentId, userId)
    }


    private logData(options: any) {
        const logger = new Logger('CommentController')
        if (options.user) return logger.log('USER' + JSON.stringify(options.user))
        if (options.body) return logger.log('BODY' + JSON.stringify(options.body))
        if (options.id) return logger.log('COMMENT' + JSON.stringify(options.id))
    }

}
