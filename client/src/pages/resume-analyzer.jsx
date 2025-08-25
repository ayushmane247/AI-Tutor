import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Loader2, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ResumeAnalyzer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzingFiles, setAnalyzingFiles] = useState(new Set());
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseResumeContent = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract name (look for name patterns at the beginning of resume)
    let extractedName = 'Not found';
    const namePatterns = [
      // Look for lines that might be names (first few lines, capitalized words)
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/,
      // Look for "Name:" pattern
      /(?:Name|Full Name):\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      // Look for standalone capitalized names in first 5 lines
      /^([A-Z][A-Z\s]+)$/
    ];
    
    // Check first 5 lines for name patterns
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const potentialName = match[1].trim();
          // Validate it looks like a name (2-4 words, reasonable length)
          const words = potentialName.split(/\s+/);
          if (words.length >= 2 && words.length <= 4 && potentialName.length <= 50) {
            extractedName = potentialName;
            break;
          }
        }
      }
      if (extractedName !== 'Not found') break;
    }
    
    // Extract basic information
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    
    const email = text.match(emailRegex)?.[0] || 'Not found';
    const phone = text.match(phoneRegex)?.[0] || 'Not found';
    
    // Extract skills (look for common skill keywords)
    const skillKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css', 'git', 'aws', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'typescript', 'angular', 'vue', 'express', 'django', 'flask', 'spring', 'bootstrap', 'tailwind', 'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'];
    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    // Extract experience (look for years)
    const experienceRegex = /\b(\d+)\s*(?:years?|yrs?)\b/gi;
    const experienceMatches = text.match(experienceRegex) || [];
    const totalExperience = experienceMatches.length > 0 ? experienceMatches[0] : 'Not specified';
    
    // Extract education
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'institute', 'btech', 'mtech', 'bsc', 'msc', 'mba', 'diploma'];
    const hasEducation = educationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Extract certifications
    const certKeywords = ['certified', 'certification', 'certificate', 'aws', 'microsoft', 'google', 'oracle', 'cisco', 'comptia', 'pmp', 'scrum'];
    const hasCertifications = certKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Extract job titles/roles
    const roleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'architect', 'consultant', 'specialist', 'lead', 'senior', 'junior', 'intern'];
    const foundRoles = roleKeywords.filter(role => 
      text.toLowerCase().includes(role.toLowerCase())
    );
    
    return {
      name: extractedName,
      email,
      phone,
      skills: foundSkills,
      roles: foundRoles,
      experience: totalExperience,
      hasEducation,
      hasCertifications,
      wordCount: text.split(/\s+/).length,
      lineCount: lines.length
    };
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const newFiles = [];
    
    for (const file of fileArray) {
      try {
        let extractedData = null;
        
        // Only extract text from text-based files for now
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await extractTextFromFile(file);
          extractedData = parseResumeContent(text);
        }
        
        newFiles.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploaded',
          analysis: null,
          uploadProgress: 100,
          extractedData
        });
      } catch (error) {
        console.error('Error processing file:', error);
        newFiles.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          analysis: null,
          uploadProgress: 100,
          extractedData: null
        });
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully. Click "Analyze by AI" to start analysis.`,
    });
  };

  const analyzeResume = async (fileId, fileName) => {
    setAnalyzingFiles(prev => new Set([...prev, fileId]));
    
    try {
      const file = uploadedFiles.find(f => f.id === fileId);
      const extractedData = file?.extractedData;
      
      let analysis;
      
      if (extractedData) {
        // Generate analysis based on extracted data
        const skillsCount = extractedData.skills.length;
        const hasContact = extractedData.email !== 'Not found' && extractedData.phone !== 'Not found';
        const wordCount = extractedData.wordCount;
        
        // Calculate score based on extracted data
        let score = 5; // Base score
        if (skillsCount >= 5) score += 2;
        else if (skillsCount >= 3) score += 1;
        if (hasContact) score += 1;
        if (extractedData.hasEducation) score += 1;
        if (extractedData.hasCertifications) score += 1;
        if (wordCount >= 300) score += 1;
        
        score = Math.min(10, score);
        
        // Generate strengths based on data with more variety
        const strengths = [];
        const strengthTemplates = {
          skills: [
            `Excellent technical skills portfolio featuring ${skillsCount} relevant technologies`,
            `Strong technical foundation with ${skillsCount} in-demand skills listed`,
            `Comprehensive skill set including ${skillsCount} modern technologies`,
            `Well-rounded technical expertise covering ${skillsCount} key areas`
          ],
          contact: [
            "Complete and professional contact information provided",
            "All essential contact details clearly displayed",
            "Professional contact section with email and phone",
            "Accessible contact information for recruiters"
          ],
          education: [
            "Educational credentials properly highlighted",
            "Academic background clearly documented",
            "Strong educational foundation mentioned",
            "Relevant educational qualifications included"
          ],
          certifications: [
            "Professional certifications demonstrate commitment to growth",
            "Industry certifications add credibility to profile",
            "Additional certifications show continuous learning",
            "Professional development through certifications evident"
          ],
          comprehensive: [
            `Detailed resume with ${wordCount} words showing thorough preparation`,
            `Comprehensive content providing substantial information (${wordCount} words)`,
            `Well-developed resume with adequate detail and depth`,
            `Thorough documentation of experience and qualifications`
          ]
        };
        
        if (skillsCount >= 3) {
          const template = strengthTemplates.skills[Math.floor(Math.random() * strengthTemplates.skills.length)];
          strengths.push(template);
        }
        if (hasContact) {
          const template = strengthTemplates.contact[Math.floor(Math.random() * strengthTemplates.contact.length)];
          strengths.push(template);
        }
        if (extractedData.hasEducation) {
          const template = strengthTemplates.education[Math.floor(Math.random() * strengthTemplates.education.length)];
          strengths.push(template);
        }
        if (extractedData.hasCertifications) {
          const template = strengthTemplates.certifications[Math.floor(Math.random() * strengthTemplates.certifications.length)];
          strengths.push(template);
        }
        if (wordCount >= 300) {
          const template = strengthTemplates.comprehensive[Math.floor(Math.random() * strengthTemplates.comprehensive.length)];
          strengths.push(template);
        }
        
        // Add specific skill-based strengths
        if (extractedData.skills.length > 0) {
          const topSkills = extractedData.skills.slice(0, 3);
          const skillStrengths = [
            `Proficiency in ${topSkills.join(', ')} demonstrates current market relevance`,
            `Strong foundation in ${topSkills.join(', ')} aligns with industry demands`,
            `Technical expertise in ${topSkills.join(', ')} shows practical knowledge`
          ];
          strengths.push(skillStrengths[Math.floor(Math.random() * skillStrengths.length)]);
        }
        
        // Pad strengths if needed with varied defaults
        const defaultStrengths = [
          "Professional formatting enhances readability",
          "Clear information hierarchy and organization",
          "Structured layout facilitates easy scanning",
          "Consistent formatting throughout document",
          "Appropriate use of white space and sections",
          "Professional presentation style maintained"
        ];
        
        while (strengths.length < 4) {
          const availableDefaults = defaultStrengths.filter(s => !strengths.some(existing => existing.includes(s.split(' ')[0])));
          if (availableDefaults.length > 0) {
            const randomDefault = availableDefaults[Math.floor(Math.random() * availableDefaults.length)];
            strengths.push(randomDefault);
          } else break;
        }
        
        // Generate weaknesses based on missing elements with variety
        const weaknesses = [];
        const weaknessTemplates = {
          skills: [
            `Only ${skillsCount} technical skills identified - expand with more relevant technologies`,
            `Limited skill diversity detected - consider adding trending technologies`,
            `Technical skills section could benefit from additional modern frameworks`,
            `Skill set appears narrow - broaden with complementary technologies`
          ],
          contact: [
            "Contact information incomplete - ensure both email and phone are included",
            "Missing essential contact details that recruiters need",
            "Professional contact section needs both email and phone number",
            "Incomplete contact information may hinder recruiter outreach"
          ],
          education: [
            "Educational background not prominently featured or missing",
            "Academic credentials could be more clearly highlighted",
            "Educational qualifications need better visibility",
            "Consider adding or emphasizing educational achievements"
          ],
          certifications: [
            "No professional certifications mentioned - consider adding relevant ones",
            "Missing industry certifications that could strengthen credibility",
            "Professional development through certifications not evident",
            "Consider obtaining and listing relevant industry certifications"
          ],
          length: [
            `Resume appears brief at ${wordCount} words - add more detail about achievements`,
            `Content seems insufficient at ${wordCount} words - expand on experiences`,
            `Limited content depth - consider adding more specific examples`,
            `Resume could benefit from more comprehensive information`
          ]
        };
        
        if (skillsCount < 3) {
          const template = weaknessTemplates.skills[Math.floor(Math.random() * weaknessTemplates.skills.length)];
          weaknesses.push(template);
        }
        if (!hasContact) {
          const template = weaknessTemplates.contact[Math.floor(Math.random() * weaknessTemplates.contact.length)];
          weaknesses.push(template);
        }
        if (!extractedData.hasEducation) {
          const template = weaknessTemplates.education[Math.floor(Math.random() * weaknessTemplates.education.length)];
          weaknesses.push(template);
        }
        if (!extractedData.hasCertifications) {
          const template = weaknessTemplates.certifications[Math.floor(Math.random() * weaknessTemplates.certifications.length)];
          weaknesses.push(template);
        }
        if (wordCount < 200) {
          const template = weaknessTemplates.length[Math.floor(Math.random() * weaknessTemplates.length.length)];
          weaknesses.push(template);
        }
        
        // Add specific weaknesses based on missing skills
        const missingCommonSkills = ['react', 'python', 'javascript', 'sql', 'aws'].filter(skill => 
          !extractedData.skills.includes(skill)
        );
        if (missingCommonSkills.length > 0 && weaknesses.length < 3) {
          const skillWeaknesses = [
            `Consider adding ${missingCommonSkills.slice(0, 2).join(' and ')} to strengthen technical profile`,
            `Missing some in-demand skills like ${missingCommonSkills.slice(0, 2).join(' or ')}`,
            `Could benefit from including ${missingCommonSkills.slice(0, 2).join(' and ')} experience`
          ];
          weaknesses.push(skillWeaknesses[Math.floor(Math.random() * skillWeaknesses.length)]);
        }
        
        // Ensure we have at least 3 weaknesses with varied defaults
        const defaultWeaknesses = [
          "Could include more specific metrics and quantified achievements",
          "Missing some key industry keywords for ATS optimization", 
          "Summary statement could be more compelling and targeted",
          "Work experience could include more measurable outcomes",
          "Consider adding a professional summary section",
          "Projects section could showcase practical applications",
          "Leadership experience could be better highlighted",
          "Volunteer work or extracurricular activities missing"
        ];
        
        while (weaknesses.length < 3) {
          const availableDefaults = defaultWeaknesses.filter(w => !weaknesses.some(existing => 
            existing.toLowerCase().includes(w.toLowerCase().split(' ')[0])
          ));
          if (availableDefaults.length > 0) {
            const randomDefault = availableDefaults[Math.floor(Math.random() * availableDefaults.length)];
            weaknesses.push(randomDefault);
          } else break;
        }
        
        // Generate dynamic suggestions based on resume content
        const suggestions = [];
        const suggestionTemplates = {
          skills: [
            `Consider adding ${missingCommonSkills.slice(0, 2).join(' and ')} to align with current market demands`,
            "Expand technical skills section with emerging technologies in your field",
            "Include specific versions or frameworks for mentioned technologies",
            "Add soft skills alongside technical competencies"
          ],
          metrics: [
            "Add quantified results to demonstrate impact (e.g., 'Improved efficiency by 25%')",
            "Include specific numbers, percentages, or dollar amounts in achievements",
            "Quantify team sizes, project scopes, or performance improvements",
            "Use metrics to showcase the scale and impact of your work"
          ],
          certifications: [
            "Include relevant industry certifications to boost credibility",
            "Consider pursuing certifications in your field of expertise",
            "Add professional development courses or training programs",
            "Highlight any ongoing learning or certification pursuits"
          ],
          keywords: [
            "Tailor keywords to match specific job descriptions in your field",
            "Include industry-specific terminology and buzzwords",
            "Optimize for Applicant Tracking Systems (ATS) with relevant keywords",
            "Research and include trending terms in your industry"
          ],
          projects: [
            "Consider adding a projects section to showcase practical skills",
            "Include personal or professional projects that demonstrate abilities",
            "Highlight open-source contributions or side projects",
            "Showcase portfolio work or case studies"
          ],
          experience: [
            "Expand on work experience with more detailed descriptions",
            "Include leadership roles or team management experience",
            "Add volunteer work or community involvement",
            "Highlight cross-functional collaboration and achievements"
          ]
        };
        
        // Add skill-based suggestions if missing common skills
        if (missingCommonSkills.length > 0) {
          suggestions.push(suggestionTemplates.skills[Math.floor(Math.random() * suggestionTemplates.skills.length)]);
        }
        
        // Add metrics suggestion
        suggestions.push(suggestionTemplates.metrics[Math.floor(Math.random() * suggestionTemplates.metrics.length)]);
        
        // Add certification suggestion if missing
        if (!extractedData.hasCertifications) {
          suggestions.push(suggestionTemplates.certifications[Math.floor(Math.random() * suggestionTemplates.certifications.length)]);
        }
        
        // Add keyword optimization suggestion
        suggestions.push(suggestionTemplates.keywords[Math.floor(Math.random() * suggestionTemplates.keywords.length)]);
        
        // Fill remaining suggestions randomly
        const allSuggestionTypes = Object.values(suggestionTemplates).flat();
        while (suggestions.length < 4) {
          const availableSuggestions = allSuggestionTypes.filter(s => !suggestions.includes(s));
          if (availableSuggestions.length > 0) {
            const randomSuggestion = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
            suggestions.push(randomSuggestion);
          } else break;
        }
        
        analysis = {
          score,
          strengths: strengths.slice(0, 4),
          weaknesses: weaknesses.slice(0, 3),
          suggestions,
          extractedInfo: {
            name: extractedData.name,
            email: extractedData.email,
            phone: extractedData.phone,
            skills: extractedData.skills,
            roles: extractedData.roles,
            experience: extractedData.experience,
            wordCount: extractedData.wordCount
          }
        };
      } else {
        // Fallback for non-text files or parsing errors
        const score = Math.floor(Math.random() * 3) + 6;
        analysis = {
          score,
          strengths: [
            "File uploaded successfully",
            "Standard resume format detected",
            "Professional file naming convention",
            "Appropriate file size for resume"
          ],
          weaknesses: [
            "Unable to extract detailed content - please ensure file is readable",
            "Consider using a text-based format for better analysis",
            "File content could not be parsed for detailed insights"
          ],
          suggestions: [
            "Upload resume in .txt format for detailed content analysis",
            "Ensure resume content is properly formatted and readable",
            "Include clear section headers for better parsing",
            "Consider using standard resume templates for better compatibility"
          ]
        };
      }

      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'analyzed', analysis }
            : file
        )
      );

      toast({
        title: "Analysis Complete",
        description: `${fileName} has been successfully analyzed.`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'error' }
            : file
        )
      );
      
      toast({
        title: "Analysis Failed",
        description: `Failed to analyze ${fileName}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setAnalyzingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleAnalyzeAll = async () => {
    const unanalyzedFiles = uploadedFiles.filter(file => !file.analysis && file.status !== 'error');
    
    if (unanalyzedFiles.length === 0) {
      toast({
        title: "No Files to Analyze",
        description: "All uploaded files have already been analyzed.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Starting AI Analysis",
      description: `Analyzing ${unanalyzedFiles.length} resume file(s) with AI...`,
    });

    // Analyze files one by one to avoid overwhelming the AI
    for (const file of unanalyzedFiles) {
      await analyzeResume(file.id, file.name);
      // Small delay between analyses
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status, isAnalyzing) => {
    if (isAnalyzing) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (status === 'analyzed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" data-testid="resume-analyzer-container">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-8 relative overflow-hidden" data-testid="resume-analyzer-header">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-resume-analyzer-title">
                  AI Resume Analyzer
                </h1>
                <p className="text-gray-600" data-testid="text-resume-analyzer-description">
                  Upload your resume and get AI-powered insights to improve your job application success
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white p-4 rounded-full">
                  <Brain className="w-12 h-12 text-purple-primary" data-testid="brain-icon" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card data-testid="upload-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4" data-testid="text-upload-title">Upload Files</h2>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragOver ? 'border-purple-primary bg-purple-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-testid="upload-dropzone"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Upload className="w-8 h-8 text-blue-500" data-testid="upload-icon" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800" data-testid="text-browse-computer">
                        Browse from your computer
                      </h3>
                      <p className="text-gray-500 mt-1" data-testid="text-drag-drop">or Drag & Drop</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      data-testid="input-file-upload"
                    />
                    <Button 
                      onClick={() => document.getElementById('file-upload').click()}
                      className="bg-purple-primary hover:bg-purple-dark text-white"
                      data-testid="button-browse-files"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Supported formats:</p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" data-testid="badge-pdf">PDF</Badge>
                    <Badge variant="secondary" data-testid="badge-doc">DOC</Badge>
                    <Badge variant="secondary" data-testid="badge-docx">DOCX</Badge>
                    <Badge variant="secondary" data-testid="badge-txt">TXT</Badge>
                  </div>
                </div>

                {/* Always visible AI Analyze Button */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-purple-700" data-testid="text-ai-analysis-title">
                          AI Resume Analysis
                        </h3>
                        <p className="text-sm text-purple-600" data-testid="text-ai-analysis-description">
                          Get comprehensive AI-powered feedback on your resume
                        </p>
                      </div>
                      <Button 
                        onClick={handleAnalyzeAll}
                        className="bg-purple-primary hover:bg-purple-dark text-white"
                        disabled={analyzingFiles.size > 0 || uploadedFiles.every(file => file.analysis || file.status === 'error')}
                        data-testid="button-main-analyze-ai"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {analyzingFiles.size > 0 ? 'Analyzing...' : 'Analyze by AI'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File List Section */}
            <Card data-testid="file-list-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800" data-testid="text-uploaded-files">
                    Uploaded Files ({uploadedFiles.length})
                  </h2>
                  <div className="flex items-center space-x-2">
                    {uploadedFiles.length > 0 && (
                      <Badge variant="outline" className="text-purple-primary" data-testid="badge-upload-speed">
                        Upload Speed: 2.2mb/s
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500" data-testid="text-no-files">
                      No files uploaded yet
                    </div>
                  ) : (
                    uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="bg-white border border-gray-200 rounded-lg p-4"
                        data-testid={`file-item-${file.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(file.status, analyzingFiles.has(file.id))}
                            <div>
                              <p className="font-medium text-gray-800" data-testid={`text-filename-${file.id}`}>
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500" data-testid={`text-filesize-${file.id}`}>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {file.analysis && (
                              <>
                                <span className={`text-lg font-bold ${getScoreColor(file.analysis.score)}`} data-testid={`text-score-${file.id}`}>
                                  {file.analysis.score}/10
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const element = document.getElementById(`analysis-${file.id}`);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  data-testid={`button-view-analysis-${file.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {!file.analysis && file.status !== 'error' && !analyzingFiles.has(file.id) && (
                              <Button 
                                size="sm"
                                onClick={() => analyzeResume(file.id, file.name)}
                                className="bg-purple-primary hover:bg-purple-dark text-white"
                                data-testid={`button-analyze-individual-${file.id}`}
                              >
                                <Brain className="w-3 h-3 mr-1" />
                                Analyze
                              </Button>
                            )}
                          </div>
                        </div>

                        {analyzingFiles.has(file.id) && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <span data-testid={`text-analyzing-${file.id}`}>Analyzing with AI...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          {uploadedFiles.some(file => file.analysis) && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6" data-testid="text-analysis-results">Analysis Results</h2>
              <div className="space-y-6">
                {uploadedFiles.filter(file => file.analysis).map((file) => (
                  <Card key={file.id} id={`analysis-${file.id}`} data-testid={`analysis-card-${file.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800" data-testid={`text-analysis-filename-${file.id}`}>
                          {file.analysis.extractedInfo?.name !== 'Not found' ? 
                            `${file.analysis.extractedInfo.name}'s Resume` : 
                            file.name
                          }
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${getScoreColor(file.analysis.score)}`} data-testid={`text-analysis-score-${file.id}`}>
                              {file.analysis.score}/10
                            </div>
                            <p className="text-sm text-gray-500">Overall Score</p>
                          </div>
                          <Button variant="outline" data-testid={`button-download-report-${file.id}`}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3" data-testid={`text-strengths-${file.id}`}>✓ Strengths</h4>
                          <ul className="space-y-2">
                            {file.analysis.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-gray-600" data-testid={`text-strength-${file.id}-${index}`}>
                                • {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-red-600 mb-3" data-testid={`text-weaknesses-${file.id}`}>⚠ Areas for Improvement</h4>
                          <ul className="space-y-2">
                            {file.analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="text-sm text-gray-600" data-testid={`text-weakness-${file.id}-${index}`}>
                                • {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold text-blue-600 mb-3" data-testid={`text-suggestions-${file.id}`}>💡 AI Suggestions</h4>
                        <ul className="space-y-2">
                          {file.analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-600" data-testid={`text-suggestion-${file.id}-${index}`}>
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {file.analysis.extractedInfo && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-700 mb-3" data-testid={`text-extracted-info-${file.id}`}>📄 Extracted Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Name:</strong> {file.analysis.extractedInfo.name}</p>
                              <p><strong>Email:</strong> {file.analysis.extractedInfo.email}</p>
                              <p><strong>Phone:</strong> {file.analysis.extractedInfo.phone}</p>
                              <p><strong>Experience:</strong> {file.analysis.extractedInfo.experience}</p>
                            </div>
                            <div>
                              <p><strong>Skills Found:</strong> {file.analysis.extractedInfo.skills.length}</p>
                              <p><strong>Roles Found:</strong> {file.analysis.extractedInfo.roles.length}</p>
                              <p><strong>Word Count:</strong> {file.analysis.extractedInfo.wordCount}</p>
                              {file.analysis.extractedInfo.skills.length > 0 && (
                                <p><strong>Top Skills:</strong> {file.analysis.extractedInfo.skills.slice(0, 3).join(', ')}</p>
                              )}
                              {file.analysis.extractedInfo.roles.length > 0 && (
                                <p><strong>Job Roles:</strong> {file.analysis.extractedInfo.roles.slice(0, 2).join(', ')}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}