export interface Usecase<Request, Response> {
  execute(request: Request): Promise<Response>
}
