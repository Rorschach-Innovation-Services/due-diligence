import mongoose, { Schema, Document } from 'mongoose';

interface Question {
  lastedited: string;
  title: string;
  contents: string[]; 
  // name: string;
}

interface Category extends Document {
  id?: string; 
  name?: string;
  questions?: Question[];
}

const questionSchema = new Schema<Question>({
  lastedited: { type: String, required: false },
  title: { type: String, required: false },
  contents: { type: [String], required: false }, 
  // name: { type: String, required: true },
});

const categorySchema = new Schema<Category>({
    id: { type: String, required: false },
    name: { type: String, default: '', required: false },
    questions: { type: [questionSchema], default: [], required: false },
});


const CategoryModel = mongoose.models.Category || mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
