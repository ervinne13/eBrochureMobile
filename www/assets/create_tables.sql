
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER(10) PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER(10) PRIMARY KEY,
    product_id INTEGER(10),
    sort_order INTEGER(10),
    url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER(10) PRIMARY KEY,
    category_id INTEGER(10),
    sort_order INTEGER(10),
    model VARCHAR(255),
    name VARCHAR(255) UNIQUE NOT NULL,
    price DOUBLE,
    status VARCHAR(32),
    image_url VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sales_invoices (
    id INTEGER(10) PRIMARY KEY,
    total_item_qty INTEGER(10),
    total_amount DOUBLE,
    discount DOUBLE,
    status VARCHAR(64)    
);

CREATE TABLE IF NOT EXISTS sales_invoice_details (
    composite_id VARCHAR(21) PRIMARY KEY,
    sales_invoice_id INTEGER(10),
    product_id INTEGER(10),
    qty INTEGER(10),
    sub_total DOUBLE
);
