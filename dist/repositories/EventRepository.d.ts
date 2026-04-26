import { IEvent } from '../entities/Event';
export declare class EventRepository {
    findAll(options: any): Promise<{
        events: IEvent[];
        pagination: any;
    }>;
    findById(id: string): Promise<IEvent | null>;
    create(data: Partial<IEvent>): Promise<IEvent>;
    update(id: string, data: Partial<IEvent>): Promise<IEvent | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=EventRepository.d.ts.map