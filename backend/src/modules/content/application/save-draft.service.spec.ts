import { Test, TestingModule } from '@nestjs/testing';
import { SaveDraftService } from './save-draft.service';
import { POST_REPOSITORY } from '../ports/post.repository.port';

describe('SaveDraftService', () => {
  let service: SaveDraftService;
  let repo: {
    findById: jest.Mock;
    findBySlug: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveDraftService,
        { provide: POST_REPOSITORY, useValue: repo },
      ],
    }).compile();
    service = module.get(SaveDraftService);
  });

  it('creates a new draft when id is null', async () => {
    repo.findBySlug.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 42 });
    const result = await service.execute({
      id: null,
      title: 'Title',
      body: 'Body',
      slug: 'my-slug',
      description: 'Desc',
      status: 'draft',
      scheduledFor: null,
    });
    expect(result).toEqual({ id: 42 });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'my-slug',
        title: 'Title',
        excerpt: 'Desc',
        body: 'Body',
        status: 'DRAFT',
      }),
    );
  });

  it('throws when slug is taken on create', async () => {
    repo.findBySlug.mockResolvedValue({ id: 1 });
    await expect(
      service.execute({
        id: null,
        title: 'Title',
        body: 'Body',
        slug: 'taken',
        description: 'Desc',
        status: 'draft',
        scheduledFor: null,
      }),
    ).rejects.toThrow('Slug already in use');
  });

  it('updates existing post when id is set', async () => {
    repo.findById.mockResolvedValue({
      id: 1,
      publishedAt: null,
      tagNames: [],
    });
    repo.update.mockResolvedValue({ id: 1 });
    const result = await service.execute({
      id: 1,
      title: 'Updated',
      body: 'Body',
      slug: 'same-slug',
      description: 'Desc',
      status: 'draft',
      scheduledFor: null,
    });
    expect(result).toEqual({ id: 1 });
    expect(repo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        title: 'Updated',
        excerpt: 'Desc',
        body: 'Body',
        slug: 'same-slug',
        status: 'DRAFT',
      }),
    );
  });
});
