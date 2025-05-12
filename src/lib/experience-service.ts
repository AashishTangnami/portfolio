import { prisma } from './prisma';

// Types
export interface ExperienceInput {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  url?: string;
  technologies: string[];
  order?: number;
}

export interface ExperienceUpdateInput {
  company?: string;
  position?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date | null;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
  url?: string;
  technologies?: string[];
  order?: number;
}

/**
 * Get all experience entries
 * @returns Array of experience entries
 */
export async function getAllExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    });

    return experiences;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
}

/**
 * Get an experience entry by ID
 * @param id - The ID of the experience entry
 * @returns The experience entry or null if not found
 */
export async function getExperienceById(id: string) {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id }
    });

    return experience;
  } catch (error) {
    console.error(`Error fetching experience with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new experience entry
 * @param data - The experience data
 * @returns The created experience entry
 */
export async function createExperience(data: ExperienceInput) {
  try {
    // Create the experience entry
    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        position: data.position,
        location: data.location,
        startDate: data.startDate,
        endDate: data.current ? null : data.endDate,
        current: data.current,
        description: data.description,
        responsibilities: data.responsibilities,
        url: data.url,
        technologies: data.technologies,
        order: data.order || 0
      }
    });
    
    return experience;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
}

/**
 * Update an experience entry
 * @param id - The ID of the experience entry to update
 * @param data - The updated experience data
 * @returns The updated experience entry
 */
export async function updateExperience(id: string, data: ExperienceUpdateInput) {
  try {
    // Handle the current flag and endDate
    let updateData: any = { ...data };
    
    // If current is true, set endDate to null
    if (data.current === true) {
      updateData.endDate = null;
    }
    
    // Update the experience entry
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    return experience;
  } catch (error) {
    console.error(`Error updating experience with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an experience entry
 * @param id - The ID of the experience entry to delete
 * @returns The deleted experience entry
 */
export async function deleteExperience(id: string) {
  try {
    const experience = await prisma.experience.delete({
      where: { id }
    });
    
    return experience;
  } catch (error) {
    console.error(`Error deleting experience with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Reorder experience entries
 * @param experienceOrders - Array of experience IDs and their new order values
 * @returns True if successful
 */
export async function reorderExperiences(experienceOrders: { id: string; order: number }[]) {
  try {
    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(
      experienceOrders.map(item => 
        prisma.experience.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
    
    return true;
  } catch (error) {
    console.error('Error reordering experiences:', error);
    throw error;
  }
}
