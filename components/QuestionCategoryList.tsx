// components/QuestionCategoryList.tsx
import { useState } from "react";
import { faEllipsisH, faEllipsisV, faPencilAlt, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionsDropdown from "./OptionsDropdown";

interface Question {
  id: string;
  title: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
  questions: Array<Question>;
}

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps) {
  const categories: Category[] = [
    {
      id: '1',
      name: 'QUESTIONS RELATING TO THE UCT’S OVERALL GOVERNANCE STRUCTURE & GENERAL GOVERNANCE ISSUES',
      questions: [
        {
          id: '1',
          title: 'What is the legal status of the organisation?',
          content: 'The University of Cape Town (UCT) is a university incorporated in accordance with the Higher Education Act, 101 of 1997...',
        },
        {
          id: '2',
          title: 'What is the registration number and name of the registration body with which your organisation is registered?',
          content: 'N/A',
        },
        {
          id: '3',
          title: 'Is your organisation affiliated with another organisation?',
          content: 'No.',
        },
        {
          id: '4',
          title: 'Who is the head of your organisation and what is his/her job title?',
          content: 'Professor Daya Reddy, [Interim] Vice-Chancellor [For US funding applications, it is appropriate to add that in South Africa the Vice-Chancellor is the equivalent of the President of an American university.]',
        },
        {
          id: '5',
          title: 'Describe the corporate governance of the university.',
          content: 'The University is governed by a 30-member Council, which consists of the executive officers, other employees of the institution, students and persons not members of staff or students of the institution...',
        },
        {
          id: '6',
          title: 'Please provide an organogram that shows the structure of your organisation (including the main executive and non-executive governance boards) and indicate the main board(s) for governance of research.',
          content: '[Insert organogram]',
        },
        {
          id: '7',
          title: 'Please provide a list or a link of current members of the governing board (at UCT the ‘governing board’ = Council)',
          content: 'The current members of the UCT Council can be viewed here: [Link]',
        },
        {
          id: '8',
          title: 'Does the organization have a policy that demonstrates its governance structure in all its grant applications?',
          content: 'The University has clear procedures to be followed in regard to the application for grants, the management of grants once they are awarded, and the close-out of grants...',
        },
        {
          id: '9',
          title: 'Please provide a breakdown of the number of staff in your organisation for categories (i) permanent staff and (ii) temporary staff:',
          content: 'Permanent: 4,984 (1,264 academic, 3,698 professional, administrative support and service, and 22 external); temporary: +- 1,670...',
        },
        {
          id: '10',
          title: 'Does the organization have a process that defines the frequency of meetings of its governing board?',
          content: 'Yes. The Council meets 4 times per year and the Executive Committee of Council meets 6 times per year. See the UCT Calendar of Meetings.',
        },
      ],
    },
    {
      id: '2',
      name: 'Questions relating specifically to the governance of the research enterprise at UCT',
      questions: [
        {
          id: '1',
          title: 'How are you?',
          content: 'Nothing to say.... i i i do not want to talk',
        },
        {
          id: '2',
          title: 'How many?',
          content: 'Thousands and thousands of them',
        },
      ],
    },
  ];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    onCategoryChange(selectedCategory);
  };

  const handleOptionClick = (option: string, categoryId: string) => {
    // Handle the click event for each option (share, rename, edit)
    // For now, we can just log the option and category ID
    console.log(option, categoryId);
    // You can add additional logic here based on the selected option
  };

  const handleCloseOptions = () => {
    // Close the options when clicking outside the options card
    setShowOptions(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold mb-2">Overview of FAQ</h2>

      <div className="space-y-2 ml-1">
        {categories.map((cat) => (
          <div key={cat.id} className="relative">
            <div
              className={`flex items-center text-xs mr-6 px-1 py-2 rounded ${cat.id === selectedCategoryId ? "bg-blue-500 text-white" : "hover:bg-blue-100 bg-gray-200"
                } cursor-pointer overflow-hidden`}
              style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              onClick={() => handleCategoryChange(cat.id)}
              title={cat.name} // Show full category name on hover
            >
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}

              {cat.id === selectedCategoryId && (
                <div
                  className="absolute top-2 right-0 bottom-0 mr-2 cursor-pointer"
                  onClick={() => setShowOptions(showOptions === cat.id ? null : cat.id)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600" />
                </div>
              )}
            </div>
            <OptionsDropdown
              categoryId={cat.id}
              isOpen={showOptions === cat.id}
              onOptionClick={handleOptionClick}
              onClose={handleCloseOptions}
            />
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-2">Overview of Abbreviations</h2>
      <h2 className="text-sm font-semibold mb-2">Contact details</h2>
    </div>
  );
}