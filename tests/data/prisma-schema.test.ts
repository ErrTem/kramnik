import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '../..');
const schemaPath = join(root, 'apps/api/prisma/schema.prisma');
const rootPkgPath = join(root, 'package.json');

function readSchema(): string {
  return readFileSync(schemaPath, 'utf8');
}

describe('prisma schema contract', () => {
  it('defines core models User, Product, Order, OrderItem', () => {
    const schema = readSchema();
    expect(schema).toContain('model User');
    expect(schema).toContain('model Product');
    expect(schema).toContain('model Order');
    expect(schema).toContain('model OrderItem');
  });

  it('defines Role, Category, and OrderStatus enums', () => {
    const schema = readSchema();
    expect(schema).toContain('enum Role');
    expect(schema).toContain('enum Category');
    expect(schema).toContain('enum OrderStatus');
    expect(schema).toContain('CUSTOMER');
    expect(schema).toContain('ADMIN');
    expect(schema).toContain('HOME');
    expect(schema).toContain('GARBAGE');
    expect(schema).toContain('SCRAPS');
    expect(schema).toContain('GARDEN_GNOMES');
    expect(schema).toContain('PENDING');
    expect(schema).toContain('CONFIRMED');
    expect(schema).toContain('SHIPPED');
    expect(schema).toContain('CANCELLED');
  });

  it('stores passwordHash on User without a plaintext password column', () => {
    const schema = readSchema();
    expect(schema).toContain('passwordHash');
    expect(schema).not.toMatch(/^\s*password\s+String/m);
    expect(schema).not.toContain('password String');
  });

  it('uses Decimal(10, 2) on price, total, and unitPrice', () => {
    const schema = readSchema();
    const decimalAttrs = schema.match(/@db\.Decimal\(10,\s*2\)/g);
    expect(decimalAttrs?.length).toBeGreaterThanOrEqual(3);
    expect(schema).toMatch(/price\s+Decimal\s+@db\.Decimal\(10,\s*2\)/);
    expect(schema).toMatch(/total\s+Decimal\s+@db\.Decimal\(10,\s*2\)/);
    expect(schema).toMatch(/unitPrice\s+Decimal\s+@db\.Decimal\(10,\s*2\)/);
  });

  it('restricts deleting products referenced by order items', () => {
    const schema = readSchema();
    expect(schema).toContain('onDelete: Restrict');
    expect(schema).toMatch(
      /product\s+Product\s+@relation\([^)]*onDelete:\s*Restrict/,
    );
  });

  it('root package.json defines db:migrate, db:seed, db:studio, db:reset, db:generate', () => {
    const pkg = readFileSync(rootPkgPath, 'utf8');
    expect(pkg).toContain('"db:migrate"');
    expect(pkg).toContain('"db:seed"');
    expect(pkg).toContain('"db:studio"');
    expect(pkg).toContain('"db:reset"');
    expect(pkg).toContain('"db:generate"');
    expect(pkg).toContain('@kramnik/api exec prisma');
  });
});
