import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { XingineInspectorService } from './xingine-inspector.service';

@Module({
  imports: [DiscoveryModule],
  providers: [XingineInspectorService, MetadataScanner],
  exports: [XingineInspectorService],
})
export class XingineModule {}
