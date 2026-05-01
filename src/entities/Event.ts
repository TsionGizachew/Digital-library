import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  status: 'upcoming' | 'past' | 'cancelled';
  authorId: string;
  authorName: string;
  image?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'past', 'cancelled'],
      default: 'upcoming',
    },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Middleware to automatically update status based on date before any find operation
EventSchema.pre(/^find/, function (next) {
  const currentDate = new Date();
  
  // Update all events where date has passed and status is still 'upcoming'
  Event.updateMany(
    {
      date: { $lt: currentDate },
      status: 'upcoming',
    },
    {
      $set: { status: 'past' },
    }
  ).exec();
  
  next();
});

// Static method to manually update event statuses
EventSchema.statics.updateEventStatuses = async function () {
  const currentDate = new Date();
  
  const result = await this.updateMany(
    {
      date: { $lt: currentDate },
      status: 'upcoming',
    },
    {
      $set: { status: 'past' },
    }
  );
  
  return result;
};

export const Event = model<IEvent>('Event', EventSchema);
