export interface ICrudResolver {
  findById(ctx: any): Promise<object>;

  findAll(ctx: any): Promise<object>;

  create(ctx: any, args: { input }): Promise<object>;

  update(ctx: any, args: { input }): Promise<object>;

  updateById(ctx: any, args: { input }): Promise<object>;

  destroy(ctx: any): Promise<object>;

  destroyById(ctx: any): Promise<object>;
}
