import { IAnnouncement } from '../entities/Announcement';
export declare class AnnouncementRepository {
    findAll(options: any): Promise<{
        announcements: IAnnouncement[];
        pagination: any;
    }>;
    findById(id: string): Promise<IAnnouncement | null>;
    create(data: Partial<IAnnouncement>): Promise<IAnnouncement>;
    update(id: string, data: Partial<IAnnouncement>): Promise<IAnnouncement | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=AnnouncementRepository.d.ts.map