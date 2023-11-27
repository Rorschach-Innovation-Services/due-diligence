interface Question {
    _id: string;
    title: string;
    contents: string[];
  }
  
  interface Category {
    _id: string;
    name: string;
    group: string | null;
    questions: Array<Question>;
    isEditing?: boolean;
  }

export const loadAllGroups = async () => {
    try {
      const response = await fetch("/api/group");
      const data = await response.json();
      return data.groups || [];
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  };
  
  export const loadGroupedCategories = async () => {
    try {
      const categoriesData = await fetch("/api/categories");
      const data = await categoriesData.json();
      const grouped = await groupCategories(data.categories);
      return grouped;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {};
    }
  };
  
  const groupCategories = async (categories: Category[]) => {
    const groupedCategories: { [group: string]: Category[] } = {};

    for (let cat of categories) {
      let groupName = 'UNGROUPED';

      if (cat.group) {
        // Fetch group information from the API
        try {
          const response = await fetch(`/api/group?groupId=${cat.group}`); //cat.group = groupId
          const data = await response.json();
          console.log("Group data:", data)
          if (data.group && data.group.name) {
            groupName = data.group.name;
          }
        } catch (error) {
          console.error(`Error fetching group for category ${cat._id}:`, error);
        }
      }

      if (!groupedCategories[groupName]) {
        groupedCategories[groupName] = [];
      }
      groupedCategories[groupName].push(cat);
    }
    // Include groups without categories
    const allGroups = await fetch("/api/group"); // Replace with your API endpoint for fetching groups
    const groupsData = await allGroups.json();
    console.log("All groups:", groupsData)
    const allGroupNames = groupsData.groups.map((group: any) => group.name);

    for (let groupName of allGroupNames) {
      if (!groupedCategories[groupName]) {
        groupedCategories[groupName] = [];
      }
    }

    return groupedCategories;
  };
  