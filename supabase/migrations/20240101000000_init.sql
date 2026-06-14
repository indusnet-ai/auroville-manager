-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist"; -- Needed for daterange exclude constraint

-- Set up storage for photos and receipts
insert into storage.buckets (id, name, public) values ('cottage_photos', 'cottage_photos', true);
insert into storage.buckets (id, name, public) values ('expense_receipts', 'expense_receipts', false);

-- Profiles Table (Extends auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    full_name text,
    phone text,
    gstin text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cottages Table
create table public.cottages (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users not null,
    name text not null,
    address text,
    photos text[] default '{}',
    max_tenants int default 3,
    gst_applicable boolean default false,
    rate_daily numeric(10, 2),
    rate_weekly numeric(10, 2),
    rate_monthly numeric(10, 2),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings Table
create type booking_status as enum ('booked', 'checked_in', 'checked_out', 'cancelled');
create type rate_type as enum ('daily', 'weekly', 'monthly');

create table public.bookings (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users not null,
    cottage_id uuid references public.cottages on delete cascade not null,
    guest_name text not null,
    phone text,
    checkin_date date not null,
    checkout_date date not null,
    rate_type rate_type not null default 'daily',
    rate numeric(10, 2) not null,
    advance_paid numeric(10, 2) default 0.00,
    status booking_status not null default 'booked',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Constraint: Ensure checkout is after checkin
    constraint checkin_before_checkout check (checkin_date < checkout_date),
    
    -- Constraint: Prevent overlapping bookings for the same cottage (excluding cancelled ones)
    exclude using gist (
        cottage_id with =,
        daterange(checkin_date, checkout_date, '[)') with &&
    ) where (status != 'cancelled')
);

-- Expenses Table
create table public.expenses (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references auth.users not null,
    cottage_id uuid references public.cottages on delete set null,
    category text not null,
    amount numeric(10, 2) not null,
    expense_date date not null,
    receipt_photo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Cottages
alter table public.cottages enable row level security;
create policy "Users can view own cottages." on public.cottages for select using (auth.uid() = owner_id);
create policy "Users can insert own cottages." on public.cottages for insert with check (auth.uid() = owner_id);
create policy "Users can update own cottages." on public.cottages for update using (auth.uid() = owner_id);
create policy "Users can delete own cottages." on public.cottages for delete using (auth.uid() = owner_id);

-- Bookings
alter table public.bookings enable row level security;
create policy "Users can view own bookings." on public.bookings for select using (auth.uid() = owner_id);
create policy "Users can insert own bookings." on public.bookings for insert with check (auth.uid() = owner_id);
create policy "Users can update own bookings." on public.bookings for update using (auth.uid() = owner_id);
create policy "Users can delete own bookings." on public.bookings for delete using (auth.uid() = owner_id);

-- Expenses
alter table public.expenses enable row level security;
create policy "Users can view own expenses." on public.expenses for select using (auth.uid() = owner_id);
create policy "Users can insert own expenses." on public.expenses for insert with check (auth.uid() = owner_id);
create policy "Users can update own expenses." on public.expenses for update using (auth.uid() = owner_id);
create policy "Users can delete own expenses." on public.expenses for delete using (auth.uid() = owner_id);

-- Storage RLS
create policy "Users can upload cottage photos." on storage.objects for insert with check (bucket_id = 'cottage_photos' and auth.role() = 'authenticated');
create policy "Users can update own cottage photos." on storage.objects for update using (bucket_id = 'cottage_photos' and auth.role() = 'authenticated');
create policy "Users can delete own cottage photos." on storage.objects for delete using (bucket_id = 'cottage_photos' and auth.role() = 'authenticated');

create policy "Users can upload expense receipts." on storage.objects for insert with check (bucket_id = 'expense_receipts' and auth.role() = 'authenticated');
create policy "Users can view own expense receipts." on storage.objects for select using (bucket_id = 'expense_receipts' and auth.role() = 'authenticated');

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
