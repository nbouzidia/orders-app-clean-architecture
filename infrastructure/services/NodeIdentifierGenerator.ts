import { IdentifierGenerator } from "../../application/services/IdentifierGenerator";
import { randomUUID } from "crypto";

export class NodeIdentifierGenerator implements IdentifierGenerator {
  public generate(): string {
    return randomUUID();
  }
}
