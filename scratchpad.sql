-- Mock query to visualize the attendance trend logic
SELECT 
    ar.date,
    c.course_code,
    COUNT(CASE WHEN ar.status = 'present' THEN 1 END) as present_count,
    COUNT(*) as total_records
FROM attendance_records ar
JOIN enrollments e ON ar.enrollment_id = e.id
JOIN courses c ON e.course_id = c.id
WHERE ar.date >= NOW() - INTERVAL '30 days'
GROUP BY ar.date, c.course_code
ORDER BY ar.date;
