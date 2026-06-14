-- Create a test user
insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role)
values 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'owner@example.com', crypt('password123', gen_salt('bf')), now(), 'authenticated');

-- Profile is auto-created by trigger, but we can update it
update public.profiles set full_name = 'Auroville Owner', phone = '1234567890' where id = '00000000-0000-0000-0000-000000000001';

-- Insert 2 Cottages
insert into public.cottages (id, owner_id, name, address, rate_daily, rate_weekly, rate_monthly, max_tenants) values
('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Sunshine Cottage', 'Auroville Center', 1500, 9000, 30000, 2),
('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Forest Retreat', 'Kottakarai', 2000, 12000, 40000, 4);

-- Insert 3 Bookings
insert into public.bookings (owner_id, cottage_id, guest_name, phone, checkin_date, checkout_date, rate_type, rate, advance_paid, status) values
('00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'John Doe', '9876543210', current_date - interval '5 days', current_date + interval '2 days', 'daily', 1500, 3000, 'checked_in'),
('00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Jane Smith', '9876543211', current_date + interval '3 days', current_date + interval '10 days', 'weekly', 9000, 0, 'booked'),
('00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Alice Cooper', '9876543212', current_date - interval '20 days', current_date - interval '2 days', 'monthly', 40000, 40000, 'checked_out');

-- Insert 1 Expense
insert into public.expenses (owner_id, cottage_id, category, amount, expense_date) values
('00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Cleaning', 500, current_date - interval '1 day');
