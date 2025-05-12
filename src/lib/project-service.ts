import { prisma } from './prisma';
import { slugify } from './utils';

// Types
export interface ProjectInput {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured?: boolean;
  order?: number;
}

export interface ProjectUpdateInput {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  featured?: boolean;
  order?: number;
}

/**
 * Get all projects
 * @param limit - Maximum number of projects to return
 * @param offset - Number of projects to skip
 * @returns Array of projects
 */
export async function getAllProjects(limit = 100, offset = 0) {
  try {
    const projects = await prisma.project.findMany({
      take: limit,
      skip: offset,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { publishedAt: 'desc' }
      ]
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Get featured projects
 * @param limit - Maximum number of projects to return
 * @returns Array of featured projects
 */
export async function getFeaturedProjects(limit = 6) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true
      },
      take: limit,
      orderBy: [
        { order: 'asc' },
        { publishedAt: 'desc' }
      ]
    });

    return projects;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
}

/**
 * Get a project by ID
 * @param id - The ID of the project
 * @returns The project or null if not found
 */
export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    return project;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get a project by slug
 * @param slug - The slug of the project
 * @returns The project or null if not found
 */
export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug }
    });

    return project;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Create a new project
 * @param data - The project data
 * @returns The created project
 */
export async function createProject(data: ProjectInput) {
  try {
    // Generate slug from title
    const slug = slugify(data.title);
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        technologies: data.technologies,
        featured: data.featured || false,
        order: data.order || 0
      }
    });
    
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Update a project
 * @param id - The ID of the project to update
 * @param data - The updated project data
 * @returns The updated project
 */
export async function updateProject(id: string, data: ProjectUpdateInput) {
  try {
    // Generate slug if title is provided
    const slug = data.title ? slugify(data.title) : undefined;
    
    // Update the project
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        technologies: data.technologies,
        featured: data.featured,
        order: data.order,
        updatedAt: new Date()
      }
    });
    
    return project;
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a project
 * @param id - The ID of the project to delete
 * @returns The deleted project
 */
export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.delete({
      where: { id }
    });
    
    return project;
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Reorder projects
 * @param projectOrders - Array of project IDs and their new order values
 * @returns True if successful
 */
export async function reorderProjects(projectOrders: { id: string; order: number }[]) {
  try {
    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(
      projectOrders.map(item => 
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
    
    return true;
  } catch (error) {
    console.error('Error reordering projects:', error);
    throw error;
  }
}
