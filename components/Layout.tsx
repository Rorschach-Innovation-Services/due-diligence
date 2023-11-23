// components/Layout.tsx
'use client';
import { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import QuestionCategoryList from "./QuestionCategoryList";
import QuestionItemList from "./QuestionItemList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCancel, faClose, faTimes } from "@fortawesome/free-solid-svg-icons";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [asideOpen, setAsideOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  const toggleAside = () => {
    setAsideOpen(!asideOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Close the sidebar if the click is outside of it
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setAsideOpen(false);
      }
    };

    // Attach the event listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (

    <div className="flex bg-gray-900">
      <aside ref={sidebarRef} className={`md:w-84 border-r border-gray-300 bg-slate-900 transition-transform transform fixed h-full z-10 ${asideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* profile */}
        <div className="p-4 flex justify-end">
          <button onClick={toggleAside} className="text-white">
            <FontAwesomeIcon icon={asideOpen ? faTimes : faBars} />
          </button>
        </div>
        <QuestionCategoryList onCategoryChange={handleCategoryChange} />
        
      </aside>

      <div className="flex flex-col flex-1 ">
        <Navbar onToggleAside={toggleAside} />

        <main className="p-6 flex-2 bg-gray-100 overflow-y-auto min-h-screen">
          {/* Page content */}
          {selectedCategory ? <QuestionItemList selectedCategory={selectedCategory} /> :
            <div>

              <br />
              <div className=" text-sm max-w-screen-lg mx-auto whitespace-pre-line text-justify">
                <h1 className="font-bold text-lg">INTRODUCTION</h1>
                <p>Ethical and financial probity in the administration of research grants and in doing the research itself is a sacrosanct principle for UCT. Funders typically want information about UCT’s overall governance structure, how it manages overall risk in the university, how it specifically manages risk, how it ensures corruption-free and ethical procurement, how it treats its staff and human subjects in research, how it ensures all other aspects of the ethical conduct of research, and how it operates ethically at a university-wide level. It is imperative that the University should be compliant with international standards, and the fact that funders are increasingly probing in detail the exercise of due diligence by awardees (and the institutions in which they carry out their research) presents UCT with a challenge. The challenge is that the level of the scrutiny by funders has meant that individual researchers who are applying for, or who have received, funding are requested to answer increasingly complex sets of due-diligence questions relating to compliance as well as to provide evidence of the content and implementation of the policies underlying the compliance. This is at task which individual researchers can only do with great difficulty and currently, RC&I, CFR and IGH assist researchers in answering these questions, but they have been rendering this assistance in a situation where there is no clear policy and procedure governing this important aspect of research compliance. In order to rectify this, two interventions are necessary.</p>
                <br />
                <p>
                  First, it is essential to establish that that individual researchers should not answer these due diligence questionnaires by themselves, but rather that such questionnaires should always receive an institutional response. The reason is that the answers mostly require a detailed knowledge of various sectors of UCT’s operations, including which policies have been adopted, where to find the latest version of the policies, and how they are implemented. Researchers generally do not possess this knowledge and this could lead to incorrect information being disseminated, which exposes both the individual researcher and the University to unnecessary risk. The draft Pre- and Post Award Policy and Procedures therefore provides as follows:
                </p>
                <br />
                <i  >
                  “1.2.4 Responding to due diligence questionnaires in regard to UCT’s financial and ethics and/or integrity policies, as well as its financial and general administrative ability by funders
                  Whenever a funder requires a PI who has applied for, or who has received, funding to answer questions relating to UCT’s compliance with financial, ethical and management best practices (and to provide evidence of the content and implementation of the policies underlying the compliance), the process will be managed centrally. The PI must forward the relevant questionnaire to RC&I.  RC&I will take responsibility for completion of the questionnaire in consultation with the relevant PASS departments, including the International Grants HUB (IGH), the Central Research Finance Unit (CRF) in the Research Finance Department, the Office of Research Integrity (ORI), and Human Resources (HR).”
                </i>
                <br />
                <br />
                <p className="mb-4">
                  Secondly, it is essential to provide the necessary resources to the relevant departments that are tasked with answering the questionnaires. This involves the following:
                </p>

                <ol className=" list-decimal marker:text-blue-700 ml-4">
                  <li className="">
                    A resource must be developed that enables the relevant departments to do the work of responding to the questionnaires without requiring them to devote an unacceptable amount of their time to the task. Such a resource is a searchable online resource containing all the typical questions posed by funders in relation to due-diligence and compliance, as well as the accurate answers to these questions. This resource must be accessible to, and only to, the staff members tasked with answering the questionnaires.
                  </li>
                  <li className="">
                    A SOP must be developed to ensure that the answers to the questions are reviewed for continued accuracy at regular (to be determined) intervals and to add any new questions and answers that have emerged from questionnaires since the last update of the resource.
                  </li>
                  <li className="">
                    The resource must contain all the known due-diligence questions must be designed to be freely searchable by keywords, but it should also contain separately the questionnaires that most frequently have to filled out (i.e. emanating from specific large-scale funders of research) – and these questionnaires should be pre-populated with the answers to the generic questions (i.e. those questions and answers that do not relate to the specifics of the research-funding application in question, but relate generally to the University’s due-diligence and compliance approach).
                  </li>
                </ol>
                <br />
                <p>
                  The first step in achieving setting up such a searchable online resource is to establish a complete record of the questions posed by funders as well as lead implementers of research programmes in which UCT is a participant; and to document the current answers (or lack of answers or complete or satisfactory answers). That is the main purpose of this document, which seeks to establish as near as possible an exhaustive list of the typical due diligence questions posed by funders.
                </p>
                <br />
                <p>
                  The questions and answers are grouped into broad categories (but it should be noted that the categories overlap and different funders place certain questions in different categories (e.g. questions about financial risk management may be asked either under the general rubric of financial governance or under that of general risk management; and questions regarding the University’s measures against becoming party through its procurement policies to forms of modern slavery may be asked under the general heading of the protection of human rights or under the heading of procurement policies).
                </p>
              </div>
            </div>
          }
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
