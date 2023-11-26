import mongoose, { Schema, Document } from 'mongoose';

// Schema for the abbreviations collection
interface Abbreviation extends Document {
  short: string;
  full: string;
}

const abbreviationSchema = new Schema<Abbreviation>({
  short: { type: String, required: true },
  full: { type: String, required: true },
});

const AbbreviationModel = mongoose.models.Abbreviation || mongoose.model<Abbreviation>('Abbreviation', abbreviationSchema);

// Schema for the groups collection
interface Group extends Document {
  name: string;
}

const groupSchema = new Schema<Group>({
  name: { type: String, required: true },
});

const GroupModel = mongoose.models.Group || mongoose.model<Group>('Group', groupSchema);

// Schema for the questions collection
interface Question extends Document {
  lastedited: string;
  title: string;
  contents: string[];
}

const questionSchema = new Schema<Question>({
  lastedited: { type: String, required: false },
  title: { type: String, required: false },
  contents: { type: [String], required: false },
});

// Schema for the categories collection
interface Category extends Document {
  id?: string;
  name?: string;
  group: Schema.Types.ObjectId;
  questions?: Question[];
}

const categorySchema = new Schema<Category>({
  id: { type: String, required: false },
  name: { type: String, default: '', required: false },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: false },
  questions: { type: [questionSchema], default: [], required: false },
});

const CategoryModel = mongoose.models.Category || mongoose.model<Category>('Category', categorySchema);

export { AbbreviationModel, GroupModel, CategoryModel };
