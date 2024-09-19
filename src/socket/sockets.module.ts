import { Module } from '@nestjs/common';
import { SafetyPointGateway } from './safetypoint.gateway';

@Module({
    providers: [SafetyPointGateway],
    exports: [SafetyPointGateway],
})
export class SocketsModule { }
