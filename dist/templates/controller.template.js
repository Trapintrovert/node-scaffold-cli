"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateController = generateController;
function generateController(config) {
    const { resourceNamePascal, resourceName, orm, useDI } = config;
    const decorator = useDI ? '@injectable()\n' : '';
    const imports = useDI
        ? `import { injectable, inject } from 'tsyringe';\n`
        : '';
    const idType = orm === 'knex' ? 'number' : 'string'; // mongoose uses string IDs
    return `${imports}import { Request, Response, NextFunction } from 'express';
import { ${resourceNamePascal}Service } from '../services/${resourceName}.service';

${decorator}export class ${resourceNamePascal}Controller {
  constructor(
    ${useDI ? `@inject(${resourceNamePascal}Service) ` : ''}private ${resourceName}Service: ${resourceNamePascal}Service
  ) {}

  /**
   * GET /${resourceName}s
   * Get all ${resourceName}s
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ${resourceName}s = await this.${resourceName}Service.getAll();
      
      res.status(200).json({
        success: true,
        data: ${resourceName}s
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /${resourceName}s/:id
   * Get ${resourceName} by ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = ${idType === 'number' ? 'parseInt(req.params.id, 10)' : 'req.params.id'};
      
      ${idType === 'number'
        ? `if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
        return;
      }`
        : ''}

      const ${resourceName} = await this.${resourceName}Service.getById(id);
      
      if (!${resourceName}) {
        res.status(404).json({
          success: false,
          message: '${resourceNamePascal} not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ${resourceName}
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /${resourceName}s
   * Create a new ${resourceName}
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ${resourceName}Data = req.body;
      
      // Validate request body
      if (!${resourceName}Data || Object.keys(${resourceName}Data).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Request body is required'
        });
        return;
      }

      const new${resourceNamePascal} = await this.${resourceName}Service.create(${resourceName}Data);
      
      res.status(201).json({
        success: true,
        data: new${resourceNamePascal},
        message: '${resourceNamePascal} created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /${resourceName}s/:id
   * Update ${resourceName} by ID
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = ${idType === 'number' ? 'parseInt(req.params.id, 10)' : 'req.params.id'};
      const ${resourceName}Data = req.body;
      
      ${idType === 'number'
        ? `if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
        return;
      }`
        : ''}

      if (!${resourceName}Data || Object.keys(${resourceName}Data).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Request body is required'
        });
        return;
      }

      const updated${resourceNamePascal} = await this.${resourceName}Service.update(id, ${resourceName}Data);
      
      if (!updated${resourceNamePascal}) {
        res.status(404).json({
          success: false,
          message: '${resourceNamePascal} not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updated${resourceNamePascal},
        message: '${resourceNamePascal} updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /${resourceName}s/:id
   * Delete ${resourceName} by ID
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = ${idType === 'number' ? 'parseInt(req.params.id, 10)' : 'req.params.id'};
      
      ${idType === 'number'
        ? `if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
        return;
      }`
        : ''}

      const deleted = await this.${resourceName}Service.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: '${resourceNamePascal} not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: '${resourceNamePascal} deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
`;
}
//# sourceMappingURL=controller.template.js.map