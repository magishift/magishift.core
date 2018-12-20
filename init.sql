 INSERT INTO public.account(
      id, "createdBy", "createdAt", "isDeleted", username, password, "isActive", "_dataStatus", "updatedAt", "realm")
      VALUES ('dd143883-6e9a-4950-aefe-b04a8fa58028', 'inject', NOW(), false, 'admin',
      '$2a$10$sntAWpWp2D0UPm0DsHrW9OgxmpvIqWEgvn6RAQ1.A7X9sDC1/r4iG', true, 'submitted', NOW(), 'admin');

 INSERT INTO admin(
      id, "createdBy", "createdAt", "isDeleted", name, email, "phoneNumber", "_dataStatus", "updatedAt", "accountId")
      VALUES ('dd143883-6e9a-4950-aefe-b04a8fa58028', 'injected', NOW(), false, 'admin',
       'admin@admin.com', '123', 'submitted', NOW(), 'dd143883-6e9a-4950-aefe-b04a8fa58028');