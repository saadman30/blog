import { Module } from '@nestjs/common';

/**
 * Taxonomy module: owns tag/category capability.
 * Tag persistence is currently used by the content module via PostTag.
 * Dedicated tag CRUD or listing can be added here when needed.
 */
@Module({})
export class TaxonomyModule {}
