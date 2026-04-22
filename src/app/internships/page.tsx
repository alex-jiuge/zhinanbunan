"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SAMPLE_INTERNSHIPS, Internship } from "@/types/internship";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Building2, Percent, Briefcase } from "lucide-react";

interface UserProfile {
  major?: string;
  city?: string;
  industry?: string;
  skills?: string[];
}

function calculateMatchScore(internship: Internship, profile: UserProfile | null): number {
  if (!profile) return 0;

  let score = 0;

  if (profile.city && internship.location.includes(profile.city)) {
    score += 40;
  }

  if (profile.industry && internship.industry === profile.industry) {
    score += 30;
  }

  if (profile.major && internship.title.includes(profile.major.slice(0, 2))) {
    score += 20;
  }

  if (profile.skills) {
    const matchedSkills = profile.skills.filter((skill) =>
      internship.requirements.some((req) => req.includes(skill))
    );
    score += Math.min((matchedSkills.length / internship.requirements.length) * 10, 10);
  }

  return Math.min(Math.round(score), 100);
}

function generateMatchReasons(internship: Internship, profile: UserProfile | null): string[] {
  const reasons: string[] = [];
  if (!profile) return reasons;

  if (profile.city && internship.location.includes(profile.city)) {
    reasons.push("匹配你的首选城市");
  }
  if (profile.industry && internship.industry === profile.industry) {
    reasons.push("匹配你的目标行业");
  }
  if (profile.major && internship.title.includes(profile.major.slice(0, 2))) {
    reasons.push("与你的专业相关");
  }
  return reasons;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    const profile = storedProfile ? JSON.parse(storedProfile) : null;

    const internshipsWithScores = SAMPLE_INTERNSHIPS.map((internship) => {
      const matchScore = calculateMatchScore(internship, profile);
      return {
        ...internship,
        matchScore,
        matchReasons: generateMatchReasons(internship, profile),
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    setInternships(internshipsWithScores);
    setLoading(false);
  }, []);

  const cities = Array.from(new Set(SAMPLE_INTERNSHIPS.map((i) => i.location)));
  const industries = Array.from(new Set(SAMPLE_INTERNSHIPS.map((i) => i.industry)));

  const filteredInternships = internships.filter((internship) => {
    if (cityFilter !== "all" && internship.location !== cityFilter) return false;
    if (industryFilter !== "all" && internship.industry !== industryFilter) return false;
    return true;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
            <p className="mt-4 text-muted-foreground">正在加载实习推荐...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">实习推荐</h1>
          <p className="text-muted-foreground">
            根据你的个人资料，为你推荐最匹配的实习机会
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">城市筛选</label>
            <Select value={cityFilter} onValueChange={(value) => value && setCityFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择城市" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部城市</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">行业筛选</label>
            <Select value={industryFilter} onValueChange={(value) => value && setIndustryFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{internship.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{internship.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{internship.location}</span>
                  </div>
                </div>
                <Badge className={`${getMatchScoreColor(internship.matchScore)} text-white`}>
                  <Percent className="h-3 w-3 mr-1" />
                  {internship.matchScore}%
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {internship.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {internship.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm pt-4 border-t">
                <span className="text-muted-foreground">{internship.salary}</span>
                <span className="text-muted-foreground">{internship.duration}</span>
              </div>

              {internship.matchReasons.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium mb-2">匹配理由</p>
                  {internship.matchReasons.map((reason, index) => (
                    <p key={index} className="text-xs text-green-600">
                      ✓ {reason}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">没有找到匹配的实习机会</p>
            <button
              onClick={() => {
                setCityFilter("all");
                setIndustryFilter("all");
              }}
              className="mt-4 text-primary hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
