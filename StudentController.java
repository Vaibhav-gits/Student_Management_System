package Backend.controller.model.repository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("*")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

   
    @GetMapping
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student add(@RequestBody Student student) {
        if (student.getName() == null || student.getName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (student.getCourse() == null || student.getCourse().isEmpty()) {
            throw new IllegalArgumentException("Course is required");
        }
        if (student.getAge() <= 0 || student.getAge() > 150) {
            throw new IllegalArgumentException("Age must be between 1 and 150");
        }
        return studentRepository.save(student);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public String handleValidationExceptions(IllegalArgumentException ex) {
        return ex.getMessage();
    }

   
    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        existing.setName(student.getName());
        existing.setCourse(student.getCourse());
        existing.setAge(student.getAge());
        return studentRepository.save(existing);
    }

  
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }
}
